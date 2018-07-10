const Promise = require('bluebird');
var sonosGetDevices = require('./sonosGetDevices.js');
var sonosPlayGoogleSpeak = require('./sonosPlayGoogleSpeak.js');
var sonosSetVolume = require('./sonosSetVolume.js');
var arrayGetRandomElement = require('./arrayGetRandomElement.js');

module.exports = function sonosPlayRandomPlaylist(params){
	return sonosGetDevices()
	.then((sonosDevices) => {
		return gladys.music.getPlaylists({devicetype: sonosDevices[0]})
		.then((infoPlaylist) => {
    		var randomChoice = randomInt(0, infoPlaylist.length-1);
			if(typeof params.sayTitle == 'undefined'){
				if(typeof params.volumePlaylist != 'undefined')
					sonosSetVolume(params.volumePlaylist, sonosDevices);
				gladys.music.flushQueue({devicetype: sonosDevices[0]})
				.then(() => gladys.music.playPlaylist({identifier: infoPlaylist[randomChoice].uri, devicetype: sonosDevices[0]}))	
				.then(() => console.log('Play random playlist, title : ' + infoPlaylist[randomChoice].title));	
			}
			else{
				if(typeof params.volumeTitle == 'undefined')
					params.volumeTitle = 40;
				if(typeof params.addTextBeforeTitle == 'undefined')
					params.addTextBeforeTitle = '';
				sonosPlayGoogleSpeak({language: params.sayTitle, text: params.addTextBeforeTitle + infoPlaylist[randomChoice].title, volume: params.volumeTitle})
				.then(() => {
					if(typeof params.volumePlaylist != 'undefined')
						sonosSetVolume(params.volumePlaylist, sonosDevices);
					gladys.music.flushQueue({devicetype: sonosDevices[0]})
					.then(() => gladys.music.playPlaylist({identifier: infoPlaylist[randomChoice].uri, devicetype: sonosDevices[0]}))	
					.then(() => console.log('Play random playlist, title : ' + infoPlaylist[randomChoice].title);	
				});
			}	
		});
	});
};