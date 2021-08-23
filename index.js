const express = require('express');
//const bodyParser = require('body-parser');

const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

//app.use(bodyParser.json());
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