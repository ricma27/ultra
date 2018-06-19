const Promise = require('bluebird');
var sonosGetRandomPlaylist = require('./sonosGetRandomPlaylist.js');

module.exports = function sonosGetRandomPlaylist(){
	return new Promise(function(resolve, reject){
		getSonosDevices()
		.then((sonosDevices) => {
			setVolume(params.volume, sonosDevices);
    		gladys.music.flushQueue({devicetype: sonosDevices[0]})
			.then(() => {
				return gladys.music.playPlaylist({devicetype: sonosDevices[0], identifier: params.identifier});
			})
			.then(() => {
				console.log('Play uri playlist : ' + uri);
				resolve(1);
			});
		})
	});
};