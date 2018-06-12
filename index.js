var sonosLireMp3 = require('./lib/sonosLireMp3.js');
var sonosLireGoogleSpeak = require('./lib/sonosLireGoogleSpeak.js');
var sonosGetPlaylistAleatoire = require('./lib/sonosGetPlaylistAleatoire.js');
var sonosLirePlaylist = require('./lib/sonosLirePlaylist.js');
var hueAllumage = require('./lib/hueAllumage.js');
var hueAllumageDelai = require('./lib/hueAllumageDelai.js');
var hueClignotement = require('./lib/hueClignotement.js');
var hueLuminositeProgressive = require('./lib/hueLuminositeProgressive.js');
var hueIntensiteRegressive = require('./lib/hueIntensiteRegressive.js');
var install = require('./lib/install.js');
var uninstall = require('./lib/uninstall.js');

module.exports = function(sails) {

	return {
		sonosLireMp3: sonosLireMp3,
		sonosLireGoogleSpeak: sonosLireGoogleSpeak,
		sonosGetPlaylistAleatoire: sonosGetPlaylistAleatoire,
		sonosLirePlaylist: sonosLirePlaylist,
		hueAllumage: hueAllumage,
		hueAllumageDelai: hueAllumageDelai,
		hueClignotement: hueClignotement,
		hueLuminositeProgressive: hueLuminositeProgressive,
		hueIntensiteRegressive: hueIntensiteRegressive,
		install: install,
		uninstall: uninstall
	};
};
