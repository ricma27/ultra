const Promise = require('bluebird');
var sonosGetDevices = require('./sonosGetDevices.js');

module.exports = function sonosGetRandomPlaylist(){
	return new Promise(function(resolve, reject){
		sonosGetDevices()
    	.then((sonosDevice) => {
			gladys.music.getPlaylists({devicetype: sonosDevice[0]})
			.then((infoPlaylist) => {
    			var randomChoice = randomInt(0, infoPlaylist.length-1);
				console.log('Random playlist : ' + infoPlaylist[randomChoice].title + ' (uri : ' + infoPlaylist[randomChoice].uri + ')');
				resolve(infoPlaylist[randomChoice]);
			});
    	})
	});
};

function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}