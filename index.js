var sonosGetRandomPlaylist = require('./lib/sonosGetRandomPlaylist.js');
var sonosPlayGoogleSpeak = require('./lib/sonosPlayGoogleSpeak.js');
var sonosPlayMP3 = require('./lib/sonosPlayMP3.js');
var sonosPlayPlaylist = require('./lib/sonosPlayPlaylist.js');
var sonosPlayRandomPlaylist = require('./lib/sonosPlayRandomPlaylist.js');
var install = require('./lib/install.js');
var uninstall = require('./lib/uninstall.js');

module.exports = function(sails) {
	return {
		sonosGetRandomPlaylist: sonosGetRandomPlaylist,	
		sonosPlayGoogleSpeak: sonosPlayGoogleSpeak,		
		sonosPlayMP3: sonosPlayMP3,
		sonosPlayPlaylist: sonosPlayPlaylist,
		sonosPlayRandomPlaylist: sonosPlayRandomPlaylist,		
		install: install,
		uninstall: uninstall
	};
};
