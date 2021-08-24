const TransactionPool = require('./transactionPool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let transactionPool, transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet: newWallet, 
      recipient: 'someRecipient', 
      amount: 50 
    });
  });
});