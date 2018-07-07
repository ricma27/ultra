const Promise = require('bluebird');
var sonosGetDevices = require('./sonosGetDevices.js');
var sonosSetVolume = require('./sonosSetVolume.js');

module.exports = function sonosPlayPlaylist(params){
	return new Promise(function(resolve, reject){
		sonosGetDevices()
		.then((sonosDevices) => {
			sonosSetVolume(params.volume, sonosDevices);
    		gladys.music.flushQueue({devicetype: sonosDevices[0]})
			.then(() => {
				return gladys.music.playPlaylist({identifier: params.uri, devicetype: sonosDevices[0]});
			})
			.then(() => {
				console.log('Play uri playlist : ' + params.uri);
				resolve(1);
			});
		});
	});
};