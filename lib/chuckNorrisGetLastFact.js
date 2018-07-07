const Promise = require('bluebird');
var chuckNorrisShare = require('./chuckNorrisShare');

module.exports = function getChuckNorrisLastFact(){
	return chuckNorrisShare.lastFact;
};