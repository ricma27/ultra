const Promise = require('bluebird');
const he = require('he/he');

module.exports = function getChuckNorrisFact(){
	return new Promise(function(resolve, reject){
		gladys.utils.request('http://chucknorrisfacts.fr/api/get?data=tri:alea;type:txt;nb:1')
    	.then((result) => {
        	console.log(he.decode(result[0].fact));
    	});
    });
};