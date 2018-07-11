var sonosGetDevices = require('./sonosGetDevices.js');
var getRandomNumber = require('./getRandomNumber.js');
var getRandomElement = require('./getRandomElement.js');

module.exports = function sonosGetRandomPlaylist(){
	return sonosGetDevices()
    .then((sonosDevices) => {
		return gladys.music.getPlaylists({devicetype: sonosDevices[0]});
	})
	.then((infoPlaylist) => {
		var randomChoice = getRandomNumber(min: 0, max: infoPlaylist.lenght-1);
		console.log('Get random playlist : ' + infoPlaylist[randomChoice].title + ' (uri : ' + infoPlaylist[randomChoice].uri + ')');
		return infoPlaylist[randomChoice];
	});
};