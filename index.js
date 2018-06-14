var sonosGetRandomPlaylist = require('./lib/sonosGetRandomPlaylist.js');
var sonosGoogleSpeak = require('./lib/sonosGoogleSpeak.js');
var sonosPlayMP3 = require('./lib/sonosPlayMP3.js');
var sonosPlayPlaylist = require('./lib/sonosPlayPlaylist.js');
var install = require('./lib/install.js');
var uninstall = require('./lib/uninstall.js');

module.exports = function(sails) {
	return {
		sonosGetRandomPlaylist: sonosGetRandomPlaylist,	
		sonosGoogleSpeak: sonosGoogleSpeak,		
		sonosPlayMP3: sonosPlayMP3,
		sonosPlayPlaylist: sonosPlayPlaylist,
		install: install,
		uninstall: uninstall
	};
};
