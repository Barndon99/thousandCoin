const Wallet = require('./index');
const Transaction = require('./transaction');

const { verifySignature } = require('../helpers');

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

  describe('input', () => {
    it('has an input', () => {
      expect(transaction).toHaveProperty('input');
    });

    it('has a timestamp', () => {
      expect(transaction.input).toHaveProperty('timestamp');
    });

    it('sets a valid amount', () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it('sets the address to the senderWallets publicKey', () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it('can sign the input', () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature
        })
      ).toBe(true);
    });
  });
});