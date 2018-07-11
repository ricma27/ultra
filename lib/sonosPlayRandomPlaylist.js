var sonosGetDevices = require('./sonosGetDevices.js');
var sonosPlayGoogleSpeak = require('./sonosPlayGoogleSpeak.js');
var sonosSetVolume = require('./sonosSetVolume.js');
var getRandomNumber = require('./getRandomNumber.js');

module.exports = function sonosPlayRandomPlaylist(params){
	return sonosGetDevices()
	.then((sonosDevices) => {
		return gladys.music.getPlaylists({devicetype: sonosDevices[0]})
		.then((infoPlaylist) => {
    		var randomChoice = getRandomNumber({min: 0, max: infoPlaylist.length-1});
			if(typeof params.sayTitle == 'undefined'){
				if(typeof params.volumePlaylist != 'undefined')
					sonosSetVolume(params.volumePlaylist, sonosDevices);
				return gladys.music.flushQueue({devicetype: sonosDevices[0]})
				.then(() => gladys.music.playPlaylist({identifier: infoPlaylist[randomChoice].uri, devicetype: sonosDevices[0]}))
				.then(() => console.log('Play random playlist, title : ' + infoPlaylist[randomChoice].title));
			}
			else{
				if(typeof params.volumeTitle == 'undefined')
					params.volumeTitle = 40;
				if(typeof params.addTextBeforeTitle == 'undefined')
					params.addTextBeforeTitle = '';
				return sonosPlayGoogleSpeak({language: params.sayTitle, text: params.addTextBeforeTitle + infoPlaylist[randomChoice].title, volume: params.volumeTitle})
				.then(() => {
					if(typeof params.volumePlaylist != 'undefined')
						sonosSetVolume(params.volumePlaylist, sonosDevices);
					return gladys.music.flushQueue({devicetype: sonosDevices[0]})
					.then(() => gladys.music.playPlaylist({identifier: infoPlaylist[randomChoice].uri, devicetype: sonosDevices[0]}))	
					.then(() => console.log('Play random playlist, title : ' + infoPlaylist[randomChoice].title));	
				});
			}	
		})
	});
};