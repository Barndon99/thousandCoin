const Block = require("./block");
const { GENESIS_DATA } = require("./config");

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

  describe('genesis', () => {
    const genesisBlock = Block.genesis();

    it('returns a block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it('returns the correct data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
});