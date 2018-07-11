var he = require('he/he');
var chuckNorrisShare = require('./chuckNorrisShare');

module.exports = function chuckNorrisGetNewFact(){
	return gladys.utils.request('http://chucknorrisfacts.fr/api/get?data=tri:alea;type:txt;nb:1')
    .then((result) => {
		var fact = he.decode(result[0].fact);
		chuckNorrisShare.lastFact = fact;
        return fact;
    });
};