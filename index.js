const express = require('express');

const Blockchain = require('./blockchain.js');
const PubSub = require('./pubsub.js')

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);


app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  res.redirect('/api/blocks');
})

const port = 3000

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`)
})