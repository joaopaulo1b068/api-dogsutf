const winston = require('winston')

const Transport = require('winston-transport');
const util = require('util');

class YourCustomTransport extends Transport {
  constructor(opts) {
    super(opts);
  }
 
  log(info, callback) {
      console.log(info)
    callback();
  }
}

/**
 * info = 
 * {
 *   level: 'info'
 *   message: 'Subindo aplicacao',
 *   service: 'user-service'
 * }
 */

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new YourCustomTransport()
    ]
  })

logger.log({
    level: 'info',
    message: 'Subindo aplicacao'
})

logger.error('crashou!')