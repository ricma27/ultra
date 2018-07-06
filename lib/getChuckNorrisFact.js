const Promise = require('bluebird');
var he = require('he/he');

module.exports = function getChuckNorrisFact(){
	return new Promise(function(resolve, reject){
		gladys.utils.request('http://chucknorrisfacts.fr/api/get?data=tri:alea;type:txt;nb:1')
    	.then((result) => {
        	resolve(he.decode(result[0].fact));
    	});
    });
};