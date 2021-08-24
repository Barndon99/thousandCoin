const Wallet = require('./index');
const Transaction = require('./transaction');

describe('Transaction Class', () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = 'someString';
    amount = 50;

    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it('has an Id', () => {
    expect(transaction).toHaveProperty('id');
  });

  describe('outputMap', () => {
    it('has an outputMap', () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it('outputs the amount to the receipient', () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it('outputs the remaining balance for the sender wallet', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
    })
  });
});