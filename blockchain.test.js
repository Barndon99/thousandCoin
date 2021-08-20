const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
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

    blockchain.addBlock({ data: newData});

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  })

  describe('isValidChain()', () => {
    describe('when the chain doesn\'t start with genesis', () => {
      it('returns false', () => {
        blockchain.chain[0] = {data: 'fake-genesis'};

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('when the chain starts with the genesis block and has multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: '1'});
        blockchain.addBlock({ data: '2'});
        blockchain.addBlock({ data: '3'});
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

        describe('the chain does not contain invalid blocks', () => {
          it('returns true', () => {            
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
        });
      });
    });
  });

  describe('replaceChain()', () => {
    describe('the new chain is not longer', () => {
      it('the chain does not get replaced', () => {
        newChain.chain[0] = { new: 'value' };

        blockchain.replaceChain(newChain.chain);

        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe('when the chain is longer', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: '1'});
        blockchain.addBlock({ data: '2'});
        blockchain.addBlock({ data: '3'});
      })
      describe('the chain is invalid', () => {
        it('does not replace the chain', () => {
          newChain.chain[0].hash = 'wrong hash buddy';

          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(originalChain);
        })
      });
      
      describe('and the chain is valid', () => {
        it('replaces the chain', () => {
          blockchain.replaceChain(newChain.chain);
        
          expect(blockchain.chain === newChain.chain);
        })
      });
    });
  });
});