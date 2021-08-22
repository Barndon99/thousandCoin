const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./cryptoHash');
//Instance of a block which will eventually be chained
class Block {
  constructor({ timestamp, lastHash, data, hash, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({lastBlock, data}) {
    let timestamp, hash;
    const lastHash = lastBlock.hash;
    const { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
    return new Block({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash
    });
  }

  static adjustDifficulty ({originalBlock, timestamp}) {
    const { difficulty } = originalBlock;
    console.log("BEGIN: ", difficulty);
    const difference = timestamp - originalBlock.timestamp;

    if (difference > MINE_RATE) {
      return difficulty - 1;
    }
    
    return difficulty + 1;
  }
}

module.exports = Block;