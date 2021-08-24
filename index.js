const express = require('express');
const request = require('request');

const Blockchain = require('./blockchain/index.js');
const PubSub = require('./app/pubsub.js');
const TransactionPool = require('./wallet/transactionPool.js');
const Wallet = require('./wallet')

//starts app
const app = express();
//initializes a blockchain instance
const blockchain = new Blockchain();
//Initializes a transaction pool across the blockchain using Redis (probably)
const transactionPool = new TransactionPool();
//Wallet class is necessary to post transactions
const wallet = new Wallet();
//Uses redis to broadcast and recieve updates to the network
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


// setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;
  
  blockchain.addBlock({ data });

  pubsub.broadcastChain();
  
  res.redirect('/api/blocks');
})

app.post('/api/transaction', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });
    }
  } catch(error) {
    return res.status(400).json({type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);

  console.log('transactionPool: ', transactionPool);

  res.json({ type: 'success', transaction });
});

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

let PEER_PORT;

//Allows multiple users to connect to the redis network at once
if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

//Set a port allowing for multiple users rather than hardcoding the port
const port = PEER_PORT || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
  
  if (port !== DEFAULT_PORT) {
    syncChains();
  }
})