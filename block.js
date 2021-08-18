//Instance of a block which will eventually be chained
class Block {
  constructor({ timestamp, lastHash, data, hash }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
  }
}

const firstBlock = new Block({
  timestamp: '01/01/01', 
  lastHash: 'foo-lastHash', 
  hash: 'foo-hash', 
  data: 'foo-data'
});

console.log("*****", firstBlock)