const Promise = require('bluebird');
var sonosGetDevices = require('./sonosGetDevices.js');
var sonosPlayGoogleSpeak = require('./sonosPlayGoogleSpeak.js');
var setVolume = require('./setVolume.js');

module.exports = function sonosPlayRandomPlaylist(params){
	return new Promise(function(resolve, reject){
		sonosGetDevices()
		.then((sonosDevices) => {
			gladys.music.getPlaylists({devicetype: sonosDevices[0]})
			.then((infoPlaylist) => {
    			var randomChoice = randomInt(0, infoPlaylist.length-1);
				if(typeof params.sayTitle != 'undefined'){
					if(typeof params.volumeTitle == 'undefined')
						params.volumeTitle = params.volumePlaylist;
					sonosPlayGoogleSpeak({language: params.sayTitle, text: infoPlaylist[randomChoice].title, volume: params.volumeTitle})
					.then(() => {
						setVolume(params.volumePlaylist, sonosDevices);
						gladys.music.flushQueue({devicetype: sonosDevices[0]})
						.then(() => gladys.music.playPlaylist({identifier: infoPlaylist[randomChoice].uri, devicetype: sonosDevices[0]}))
						.then(() => {
							console.log('Play random playlist, title : ' + infoPlaylist[randomChoice].title);
							resolve(1);
						});
					});
				}
				else{
					setVolume(params.volumePlaylist, sonosDevices);
					gladys.music.flushQueue({devicetype: sonosDevices[0]})
					.then(() => gladys.music.playPlaylist({identifier: infoPlaylist[randomChoice].uri, devicetype: sonosDevices[0]}))
					.then(() => {
						console.log('Play random playlist, title : ' + infoPlaylist[randomChoice].title);
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