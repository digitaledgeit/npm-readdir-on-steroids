var Promise = require('promise');
var readdir = require('./lib/readdir');

module.exports = Promise.nodeify(readdir);
