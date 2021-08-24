const cryptoHash = require('./cryptoHash');

describe('cryptoHash()', () => {
  it('generates a SHA-256 hash', () => {
    expect(cryptoHash('password')).toEqual("ff2bea10041cceb054dd6417bc70e8e796edb94dfaeb7046b536509743fab619")
  });

  it('produces the same hash with the same arguments regardless of order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'two', 'one'));
  });

  it('creates a unique hash when the properties of an input change', () => {
    const foo = {};
    const originalHash = cryptoHash(foo);
    foo['a'] = 'a';

    expect(cryptoHash(foo)).not.toEqual(originalHash)
  })
});