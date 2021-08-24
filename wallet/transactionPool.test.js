const TransactionPool = require('./transactionPool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let transactionPool, transaction, senderWallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({
      senderWallet,
      recipient: 'someRecipient', 
      amount: 50 
    });
  });

  describe('setTransaction()', () => {
    it('adds transactions', () => {
      transactionPool.setTransaction(transaction);

      expect(transactionPool.transactionMap[transaction.id])
        .toBe(transaction);
    });
  });

  describe('existingTransaction()', () => {
    it('returns an existing transaction given an input address', () => {
      transactionPool.setTransaction(transaction);

      expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey }))
        .toBe(transaction);
    });
  });
});