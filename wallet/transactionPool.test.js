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

  describe('validTransactions()', () => {
    let validTransactions, errMock;

    beforeEach(() => {
      validTransactions = [];
      errMock = jest.fn();
      global.console.error = errMock;

      for (i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: "someRecipient",
          amount: 30
        });

        if (i % 3 === 0) {
          transaction.input.amount = 99999;
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign('foo');
        } else {
          validTransactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });

    it('returns valid transactions', () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });

    it('logs errors for invalid transactions', () => {
      transactionPool.validTransactions();
      expect(errMock).toHaveBeenCalled();
    })
  });
});