const Promise = require('bluebird');
var sonosGoogleSpeak = require('./sonosGoogleSpeak.js');

module.exports = function sonosPlayRandomPlaylist(params){
	return new Promise(function(resolve, reject){
		getSonosDevices()
		.then((sonosDevices) => {
			gladys.music.getPlaylists({devicetype: sonosDevices[0]})
			.then((infoPlaylist) => {
    			var randomChoice = randomInt(0, infoPlaylist.length-1);
				resolve(infoPlaylist[randomChoice]);
			})
			.then((randomPlaylist) => {
				if(typeof params.sayTitle != 'undefined'){
					if(typeof params.volumeTitle == 'undefined')
						params.volumeTitle = params.volumePlaylist;
					sonosGoogleSpeak({language: params.sayTitle, text: randomPlaylist.title, volume: params.volumeTitle})
					.then(() => {
						setVolume(params.volumePlaylist, sonosDevices);
						gladys.music.flushQueue({devicetype: sonosDevices[0]})
						.then(() => gladys.music.playPlaylist({identifier: randomPlaylist.uri, devicetype: sonosDevices[0]}))
						.then(() => {
							console.log('Play random playlist, title : ' + randomPlaylist.title);
							resolve(1);
						});
					});
				}
				else{
					setVolume(params.volumePlaylist, sonosDevices);
					gladys.music.flushQueue({devicetype: sonosDevices[0]})
					.then(() => gladys.music.playPlaylist({identifier: randomPlaylist.uri, devicetype: sonosDevices[0]}))
					.then(() => {
						console.log('Play random playlist, title : ' + randomPlaylist.title);
						resolve(1);
					});
				}	
			});
		});
	});
};


function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}