var sonosGoogleSpeak = require('./lib/sonosGoogleSpeak.js');
var sonosPlayMP3 = require('./lib/sonosPlayMP3.js');
var install = require('./lib/install.js');
var uninstall = require('./lib/uninstall.js');

module.exports = function(sails) {
	return {
		sonosGoogleSpeak: sonosGoogleSpeak,		
		sonosPlayMP3: sonosPlayMP3,
		install: install,
		uninstall: uninstall
	};
};
