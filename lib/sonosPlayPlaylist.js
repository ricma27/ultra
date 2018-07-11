var sonosGetDevices = require('./sonosGetDevices.js');
var sonosSetVolume = require('./sonosSetVolume.js');

module.exports = function sonosPlayPlaylist(params){
	return sonosGetDevices()
	.then((sonosDevices) => {
		return sonosSetVolume(params.volume, sonosDevices)
		.then(() => gladys.music.flushQueue({devicetype: sonosDevices[0]}))
		.then(() => gladys.music.playPlaylist({identifier: params.uri, devicetype: sonosDevices[0]}))
		.then(() => console.log('Play uri playlist : ' + params.uri));
	});
};