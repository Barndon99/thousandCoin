const { GENESIS_DATA } = require('./config');
//Instance of a block which will eventually be chained
class Block {
  constructor({ timestamp, lastHash, data, hash }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({lastBlock, data}) {
    return new Block({
      timestamp: Date.now(),
      lastHash: lastBlock.hash,
      data: data
    });
  }
}

module.exports = Block;