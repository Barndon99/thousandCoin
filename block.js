//Instance of a block which will eventually be chained
class Block {
  constructor({ timestamp, lastHash, data, hash }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
  }
}

module.exports = Block;