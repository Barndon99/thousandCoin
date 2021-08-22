//GLOBAL VALUES GO HERE
//Values for the first block, totally arbitrary.
const INITIAL_DIFFICULTY = 3;


const GENESIS_DATA = {
  timestamp: 1,
  lastHash: '!!!!!',
  hash: 'firstHash',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: []
};

module.exports = { GENESIS_DATA }