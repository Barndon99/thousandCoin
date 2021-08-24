const Wallet = require('./index');
const { verifySignature } = require('.')


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
          data,
          signature: wallet.sign
        })
      ).toBe(true);
    });

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data)
        })
      ).toBe(false);
    });
  });
});