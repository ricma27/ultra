const Promise = require('bluebird');

module.exports = function sonosGetPlaylistAleatoire(){
	return new Promise(function(resolve, reject){
		gladys.param.getValue('SONOS_DEVICE_PRINCIPAL')
    	.then((sonosDevicePrincipal) => {
			var infosPlaylistAleatoire = {
    			title: '',
    			artist: '',
				albumArtURL: '',
				album: '',
				uri: ''
			};
			gladys.music.getPlaylists({devicetype: sonosDevicePrincipal})
			.then((infosPlaylists) => {
    			var choixAleatoire = entierAleatoire(0, infosPlaylists.length-1);
				infosPlaylistAleatoire.title = infosPlaylists[choixAleatoire].title;
				infosPlaylistAleatoire.artist = infosPlaylists[choixAleatoire].artist;
				infosPlaylistAleatoire.albumArtURL = infosPlaylists[choixAleatoire].albumArtURL;
				infosPlaylistAleatoire.album = infosPlaylists[choixAleatoire].album;
				infosPlaylistAleatoire.uri = infosPlaylists[choixAleatoire].uri;
				resolve(infosPlaylistAleatoire);
			});
    	});

		function entierAleatoire(min, max){
    		return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	});
};