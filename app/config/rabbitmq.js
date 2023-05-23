var amqp = require('amqplib/');

async function start() {
    return await amqp.connect(process.env.AMQPURL);
  }

  module.exports = start()