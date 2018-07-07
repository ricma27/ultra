var allDevicesOff = require('./lib/allDevicesOff.js');
var arrayGetRandomElement = require('./lib/arrayGetRandomElement.js');
var systemDelay = require('./lib/systemDelay.js');
var systemReboot = require('./lib/systemReboot.js');
var systemShutdown = require('./lib/systemShutdown.js');
var chuckNorrisGetFact = require('./lib/chuckNorrisGetFact.js');
var chuckNorrisGetLastFact = require('./lib/chuckNorrisGetLastFact.js');
var hueBlink = require('./lib/hueBlink.js');
var hueGetDevicesType = require('./lib/hueGetDevicesType.js');
var hueOff = require('./lib/hueOff.js');
var hueOn = require('./lib/hueOn.js');
var hueProgressiveBrightness = require('./lib/hueProgressiveBrightness.js');
var hueRegressiveBrightness = require('./lib/hueRegressiveBrightness.js');
var sonosGetDevices = require('./lib/sonosGetDevices.js');
var sonosGetRandomPlaylist = require('./lib/sonosGetRandomPlaylist.js');
var sonosPlayGoogleSpeak = require('./lib/sonosPlayGoogleSpeak.js');
var sonosPlayMP3 = require('./lib/sonosPlayMP3.js');
var sonosPlayPlaylist = require('./lib/sonosPlayPlaylist.js');
var sonosPlayRandomPlaylist = require('./lib/sonosPlayRandomPlaylist.js');
var install = require('./lib/install.js');
var uninstall = require('./lib/uninstall.js');

module.exports = function(sails) {
	return {
		allDevicesOff: allDevicesOff,
		arrayGetRandomElement: arrayGetRandomElement,
		systemDelay: systemDelay,
		systemReboot: systemReboot,
		systemShutdown: systemShutdown,
		chuckNorrisGetFact: chuckNorrisGetFact,
		chuckNorrisGetLastFact: chuckNorrisGetLastFact,
		hueBlink: hueBlink,
		hueGetDevicesType: hueGetDevicesType,
		hueOff: hueOff,
		hueOn: hueOn,
		hueProgressiveBrightness: hueProgressiveBrightness,
		hueRegressiveBrightness: hueRegressiveBrightness,
		sonosGetDevices: sonosGetDevices,	
		sonosGetRandomPlaylist: sonosGetRandomPlaylist,	
		sonosPlayGoogleSpeak: sonosPlayGoogleSpeak,		
		sonosPlayMP3: sonosPlayMP3,
		sonosPlayPlaylist: sonosPlayPlaylist,
		sonosPlayRandomPlaylist: sonosPlayRandomPlaylist,	
		install: install,
		uninstall: uninstall
	};
};
