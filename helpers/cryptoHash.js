const crypto = require('crypto');
const { stringify } = require('querystring');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  
  hash.update(inputs.map(ele => JSON.stringify(ele)).sort().join(' '));

  return (hash.digest('hex'));
};

module.exports = cryptoHash;