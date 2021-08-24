const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({data: 'initial'});

let prevTimestamp, nextTimestamp, nextBlock, difference, average;

const times = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({data: `block ${i}`});
  nextBlock = blockchain.chain[blockchain.chain.length - 1];
  nextTimestamp = nextBlock.timestamp;

  difference = nextTimestamp - prevTimestamp;
  times.push(difference);

  averageTime = times.reduce((total, num) => (total + num))/times.length;

  console.log(`Time to mine 1 block ${difference}ms. Difficulty ${nextBlock.difficulty}. Avg time: ${averageTime}ms.`);
}

