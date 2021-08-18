const Block = require("./block");

describe("Block Class", () => {
  const timestamp = 'someDate';
  const lastHash = 'someLastHash';
  const data = ['data1', 'data2'];
  const hash = 'someHash';
  const block = new Block({
    timestamp,
    lastHash,
    data,
    hash
  });
  //Best practice would be to split these into 4 tests
  it('has a timestamp, lastHash, hash, data', () => {
    expect(block.timestamp).toEqual('someDate');
    expect(block.lastHash).toEqual('someLastHash');
    expect(block.hash).toEqual('someHash');
    expect(block.data.length).toEqual(2);
  });
});