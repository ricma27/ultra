const Promise = require('bluebird');
var sonosGetDevices = require('./sonosGetDevices.js');
var arrayGetRandomElement = require('./arrayGetRandomElement.js');

module.exports = function sonosGetRandomPlaylist(){
	return new Promise(function(resolve, reject){
		sonosGetDevices()
    	.then((sonosDevices) => {
			gladys.music.getPlaylists({devicetype: sonosDevices[0]})
			.then((infoPlaylist) => {
				console.log('Random playlist : ' + infoPlaylist[randomChoice].title + ' (uri : ' + infoPlaylist[randomChoice].uri + ')');
				resolve(arrayGetRandomElement(infoPlaylist));
			});
    	});
	});
};