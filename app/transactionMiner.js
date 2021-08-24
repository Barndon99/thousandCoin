class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }
  
  mineTransactions() {
    // grab valid transactions from transactionPool
  
    // generate rewards for miners

    // add a block consisting of these transactions to the blockchain

    // broadcast the new chain

    // clear all the transactions from the pool once data is collected
  }


}

module.exports = TransactionMiner;