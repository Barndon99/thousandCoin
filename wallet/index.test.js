const Wallet = require('./index');

describe('Wallet Class', () => {
  const wallet;
  
  beforeEach(() => {
    wallet = new Wallet();
  });

  it('has a balance', () => {
    expect(wallet).toHavePropert('balance');
  })

  it('has a public key', () => {
    expect(wallet).toHavePropert('publicKey');
  })
});