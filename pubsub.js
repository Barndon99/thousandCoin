const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    
    //broadcasts
    this.publisher = redis.createClient();
    //listens for messages
    this.subscriber = redis.createClient();
    //Channel we listen on
    this.subscribeToChannels();
    
    this.subscriber.on('message', (channel, message) => {this.handleMessage(channel, message)});
  }

  handleMessage(channel, message) {
    console.log(`Message received: ${message}, from channel: ${channel}`);

    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  // Subscribe to all channels on load
  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }

  publish ({ channel, message }) {
    //prevent spamming subscribers with messages *refactor?*
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });

    this.publisher.publish(channel, message);
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    })
  }
}

module.exports = PubSub;