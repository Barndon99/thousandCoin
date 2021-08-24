const {STARTING_BALANCE} = require('../config');
const { ec } = require('../helpers');
const cryptoHash = require('../helpers/cryptoHash');

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;
    
    this.keyPair = ec.genKeyPair();

    this.publicKey = this.keyPair.getPublic(); 
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }
};

module.exports = Wallet;