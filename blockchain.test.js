const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
  let blockchain = new Blockchain();

  beforeEach(() => {
    blockchain = new Blockchain();
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

        expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
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

          expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
        });

        describe('the chain contains invalid data', () => {
          it('returns false', () => {
            blockchain.chain[2].data = 'badData';
            
            expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
        });

        describe('the chain does not contain invalid blocks', () => {
          it('returns true', () => {            
            expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
        });
      });
    });
  });
});