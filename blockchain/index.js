const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { cryptoHash } = require('../helpers');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    });
    this.chain.push(newBlock);
  };

  replaceChain(chain, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer.');
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid.');
      return;
    }

    if (onSuccess) onSuccess();
    
    console.log('Replacing chain with', chain);
    this.chain = chain;
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error('Invalid block too many transactions');
            return false;
          }
          console.log("******")
          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error('Miner reward amount is invalid');
            return false;
          } 

          console.log("IN FIRST IF")
        } else {
          console.log("IN SECOND IF");
            if (!Transaction.validTransaction(transaction)) {
              console.error('Invalid transaction');
              return false;
            }
            const trueBalance = Wallet.calculateBalance({ 
              chain: this.chain, 
              address: transaction.input.address 
            });

            if (transaction.input.amount !== trueBalance) {
              console.error('invalid input amount');
              return false;
            }
        }
      }
    }
    
    return true;
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    };

    for (let i = 1; i < chain.length; i++) {
      const actualLastHash = chain[i - 1].hash;
      const { timestamp, lastHash, data, hash, difficulty, nonce } = chain[i];
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== actualLastHash) return false;

      const validHash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);

      if (hash !== validHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }


    return true;
  }
}


module.exports = Blockchain;