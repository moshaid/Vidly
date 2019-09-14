const winston = require('winston');
//require('winston-mongodb');
require('express-async-errors'); 

module.exports = function() {
winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log'}));

process.on('unhandledRejection', (ex) => {
 throw ex;
});

winston.add(new winston.transports.File({ filename: 'logfile.log'}));
/*winston.add(new winston.transports.MongoDB({ 
  db: 'mongodb://localhost/vidly',
  level: 'info'}));*/

  //const p = Promise.reject(new Error('Something failed during startup'));
  //p.then(() => console.log('Done'));
}