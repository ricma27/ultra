const Promise = require('bluebird');

module.exports = function systemDelay(time){
	var wait = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, time)});
	return wait();
};