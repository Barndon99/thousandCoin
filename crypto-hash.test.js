const cryptoHash = require('./cryptoHash');

describe('cryptoHash()', () => {
  const hash = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';

  it('generates a SHA-256 hash', () => {
    expect(cryptoHash('password')).toEqual(hash)
  });

  it('produces the same hash with the same arguments regardless of order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'two', 'one'));
  });
});