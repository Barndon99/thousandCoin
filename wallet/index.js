const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../helpers');
const Transaction = require('./transaction');


class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;

    this.keyPair = ec.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey
      });
    }

    if (amount > this.balance) {
      throw new Error('Insufficient balance');
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }
  //calculates the balance based on previous outputs in the chain
  static calculateBalance({ chain, address }) {
    let outputsTotal = 0;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      for (let transaction of block.data) {
        //Address will not always be defined
        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }
    }

    return STARTING_BALANCE + outputsTotal;
  }
};

module.exports = Wallet;