var chuckNorrisShare = require('./chuckNorrisShare');

module.exports = function chuckNorrisGetLastFact(){
	return chuckNorrisShare.lastFact;
};