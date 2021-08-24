const Wallet = require('../wallet/index');
const { verifySignature } = require('../helpers');
const Transaction = require('./transaction');
const Blockchain = require('../blockchain');
const { STARTING_BALANCE } = require('../config');


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

  describe('calculateBalance()', () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    })

    describe('there are no outputs for the wallet', () => {
      it('should return the value of the `starting balance`', () => {
        expect(       
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey
          })).toEqual(STARTING_BALANCE)
      });
    });

    describe('and there are inputs for the wallet', () => {
      let transactionOne, transactionTwo;

      beforeEach(() => {
        transactionOne = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50
        });

        transactionTwo = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 60
        });

        blockchain.addBlock({ data: [transactionOne, transactionTwo] });
      });

      it('adds all the outputs to the wallet balance', () => {
        expect(wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey
        })).toEqual(
          STARTING_BALANCE + 
          transactionOne.outputMap[wallet.publicKey] +
          transactionTwo.outputMap[wallet.publicKey]
        )
      });
    });
  });
});