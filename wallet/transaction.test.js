const Wallet = require('./index');
const Transaction = require('./transaction');

const { verifySignature } = require('../helpers');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

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

  describe('validTransaction()', () => {
    let errMock;

    beforeEach(() => {
      errMock = jest.fn();

      global.console.error = errMock;
    })
    
    describe('transaction is valid', () => {
      it('returns true', () => {
        expect(Transaction.validTransaction(transaction)).toBe(true);
      });
    });

    describe('transaction is not valid', () => {
      describe('and a transaction outputMap is invalid', () => {
        it('returns false, and logs an error', () => {
        transaction.outputMap[senderWallet.publicKey] = 999999;

        expect(Transaction.validTransaction(transaction)).toBe(false);
        expect(errMock).toHaveBeenCalled();
        });
      });

      describe('and a transaction input signature is invalid', () => {
        it('returns false, and logs an error', () => {
        transaction.input.signature = new Wallet().sign('someString');
        
        expect(Transaction.validTransaction(transaction)).toBe(false);
        expect(errMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('update()', () => {
    let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

    describe('and the amount is invalid', () => {
      it('throws an error', () => {
        expect(() => {
          transaction.update({
            senderWallet, recipient: 'foo', amount: 999999
          })
        }).toThrow('Amount exceeds balance');
      });
    })

    beforeEach(() => {
      originalSignature = transaction.input.signature;
      originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
      nextRecipient = 'nextRecipient';
      nextAmount = 50;

      transaction.update({ senderWallet, recipient: nextRecipient, amount: nextAmount});
    })
    
    it('outputs the amount to the recipient', () => {
      expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
    });

    it('has an accurate balance (substracts sender output amount)', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount);
    });

    it('maintains a total output that matches the input amount', () => {
      expect(Object.values(transaction.outputMap).reduce((total, output) => total + output))
        .toEqual(transaction.input.amount);    
    });

    it('resigns the transaction', () => {
      expect(transaction.input.signature).not.toEqual(originalSignature);
    });

    describe('and another update for the same recipient', () => {
      let addedAmount;

      beforeEach(() => {
        addedAmount = 80;
        transaction.update({
          senderWallet, recipient: nextRecipient, amount: addedAmount
        });
      });

      it('adds to the recipient amount', () => {
        expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + addedAmount);
      });

      it('substracts the newAmount from the sender output amount', () => {
        expect(transaction.outputMap[senderWallet.publicKey])
          .toEqual(originalSenderOutput - nextAmount - addedAmount);
      });
    });
  });

  describe('rewardTransaction()', () => {
    let rewardTransaction, mineWallet;

    beforeEach(() => {
      mineWallet = new Wallet();
      rewardTransaction = Transaction.rewardTransaction({ minerWallet });

      it('creates a reward transaction', () => {
        expect(rewardTransaction.input).toEqual(REWARD_INPUT);
      });

      it('creates one transaction for the miner with the MINER_REWARD', () => {
        expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
      })
    })
  })
});