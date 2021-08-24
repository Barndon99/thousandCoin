const Blockchain = require('./index');
const Block = require('./block.js');
const cryptoHash = require('../helpers/cryptoHash');

describe('Blockchain Class', () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it('contains a chain instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it('should start with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it('should be able to add a new block', () => {
    const newData = 'someData';

    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  })

  describe('isValidChain()', () => {
    describe('when the chain doesn\'t start with genesis', () => {
      it('returns false', () => {
        blockchain.chain[0] = { data: 'fake-genesis' };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('when the chain starts with the genesis block and has multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: '1' });
        blockchain.addBlock({ data: '2' });
        blockchain.addBlock({ data: '3' });
      })

      describe('a lastHash reference has changed', () => {
        it('returns false', () => {
          blockchain.chain[2].lastHash = '4';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });

        describe('the chain contains invalid data', () => {
          it('returns false', () => {
            blockchain.chain[2].data = 'badData';

            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
        });

        describe('and the chain contains a block with a jumped difficulty', () => {
          it('returns false', () => {
            const lastBlock = blockchain.chain[blockchain.chain.length - 1];

            const lastHash = lastBlock.hash;
            const timestamp = Date.now()
            const nonce = 0;
            const data = [];
            const difficulty = lastBlock.difficulty - 3;

            const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

            const badBlock = new Block({ timestamp, lastHash, difficulty, nonce, data, hash })

            blockchain.chain.push(badBlock);

            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
        });

        describe('the chain does not contain invalid blocks', () => {
          it('returns true', () => {
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
          });
        });
      });
    });
  });

  describe('replaceChain()', () => {
    //Kill console logs in the testing suite
    let errorMock, logMock;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.log = logMock;
      global.console.error = errorMock;
    });

    describe('the new chain is not longer', () => {
      beforeEach(() => {
        newChain.chain[0] = { new: 'value' };

        blockchain.replaceChain(newChain.chain);
      })

      it('the chain does not get replaced', () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it('logs error', () => {
        expect(errorMock).toHaveBeenCalled();
      })
    });

    describe('when the chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: '1' });
        newChain.addBlock({ data: '2' });
        newChain.addBlock({ data: '3' });
      });
      describe('the chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[0].hash = 'wrong hash buddy';

          blockchain.replaceChain(newChain.chain);
        });

        it('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it('logs when chain is replaced', () => {
          expect(errorMock).toHaveBeenCalled();
        })
      });

      describe('and the chain is valid', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        })

        it('replaces the chain', () => {
          expect(blockchain.chain === newChain.chain);
        });

        it('logs the replacement', () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});