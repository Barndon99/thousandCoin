const Wallet = require('./index');
const { verifySignature } = require('../helpers');
const Transaction = require('./transaction');


describe('Wallet Class', () => {
  let wallet;
  
  beforeEach(() => {
    wallet = new Wallet();
  });

  it('has a balance', () => {
    expect(wallet).toHaveProperty('balance');
  })

  it('has a public key', () => {
    expect(wallet).toHaveProperty('publicKey');
  })

  describe('it signs data', () => {
    const data = 'someString';
    
    it('verifies a signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data: data,
          signature: wallet.sign(data)
        })
      ).toBe(true);
    });

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data: data,
          signature: new Wallet().sign(data)
        })
      ).toBe(false);
    });
  });

  describe('createTransaction()', () => {
    describe('and the amount exceeds the balance', () => {
      it('throws an error', () => {
        expect(() => wallet.createTransaction({ amount: 999999, recipient: 'someName'}))
          .toThrow('Insufficient balance');
      });
    });

    describe('and the amount is valid', () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = 'someRecipient';
        transaction = wallet.createTransaction({ amount, recipient });
      })

      it('creates an instance of Transaction class', () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it('matches the transaction input', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it('outputs the correct amount to the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });
});