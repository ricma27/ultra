const Promise = require('bluebird');

module.exports = function delay(time){
	return new Promise(function(resolve, reject){
		var wait = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, time)});
		wait().then(() => resolve(1));
	});
};