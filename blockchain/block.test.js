const hexToBinary = require('hex-to-binary');

const Block = require("./block");
const cryptoHash = require("../helpers/cryptoHash");

const { GENESIS_DATA, MINE_RATE } = require("../config");

describe("Block Class", () => {
  let block;
  
  const timestamp = 2000;
  const lastHash = 'someLastHash';
  const data = ['data1', 'data2'];
  const hash = 'someHash';
  const difficulty = 1;
  const nonce = 1;
  
  beforeEach(() => {
    block = new Block({
      timestamp,
      lastHash,
      data,
      hash,
      difficulty,
      nonce
    });
  });

  //Best practice would be to split these into 4 tests
  it('has a timestamp, lastHash, hash, data', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data.length).toEqual(2);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
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

  describe('mine block', () => {
    const lastBlock = Block.genesis();
    const data = 'mined data';
    const minedBlock = Block.mineBlock({lastBlock, data});

    it('returns a block', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('set the lastHash variable to be the hash of the last block', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('sets data', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('sets a timestamp', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('creates a sha256 hash', () => {
      expect(minedBlock.hash)
        .toEqual(
          cryptoHash(
            minedBlock.timestamp, 
            lastBlock.hash, 
            minedBlock.nonce, 
            minedBlock.difficulty, 
            data
          )
        );
    });

    it('has a leading # of zeros that matches minedBlock difficulty', () => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
    });  

    it('adjusts difficulty', () => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });

    it('cannot lower difficulty below 1', () => {
      block.difficulty = -1;

      expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
    })
  });

  describe('adjust difficulty', () => {
    it('raises the difficulty when blocks are mined to quickly', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE - 100
      })).toEqual(block.difficulty + 1);
    });

    it('lowers the difficulty when blocks are mined to slowly', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty - 1);
    });
  })
});