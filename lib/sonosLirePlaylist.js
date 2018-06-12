const Promise = require('bluebird');

module.exports = function sonosLirePlaylist(uri, volumeSonos){
	return new Promise(function(resolve, reject){
    	gladys.param.getValue('SONOS_DEVICE_PRINCIPAL')
    	.then((sonosDevicePrincipal) => {
    	    sonosPrincipal = sonosDevicePrincipal
    		return gladys.param.getValue('SONOS_DEVICE_AUXILIAIRE');
    	})
    	.then((sonosDeviceAuxiliaire) => {
    	    sonosAuxiliaire = sonosDeviceAuxiliaire;
			if(typeof volumeSonos !== 'undefined'){
    			gladys.music.setVolume({devicetype: sonosPrincipal, volume: volumeSonos});
    	    	gladys.music.setVolume({devicetype: sonosAuxiliaire, volume: volumeSonos});
			}
    		gladys.music.flushQueue({devicetype: sonosPrincipal});
    		gladys.music.playPlaylist({devicetype: sonosPrincipal, identifier: uri})
			.then(resolve(1));
		});
	});
};