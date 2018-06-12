var sonosPlayMP3 = require('./lib/sonosPlayMP3.js');
var install = require('./lib/install.js');
var uninstall = require('./lib/uninstall.js');

module.exports = function(sails) {
	return {
		sonosPlayMP3: sonosPlayMP3,
		install: install,
		uninstall: uninstall
	};
};
