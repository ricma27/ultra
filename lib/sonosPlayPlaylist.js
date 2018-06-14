const Promise = require('bluebird');

module.exports = function sonosPlayPlaylist(uri, volume){
	return new Promise(function(resolve, reject){
		Promise.all([gladys.param.getValue('SONOS_MAIN_DEVICETYPE_ID'), gladys.param.getValue('SONOS_SECONDARY_DEVICETYPE_ID')])
		.then((sonosDevices) => {
    		gladys.music.setVolume({devicetype: sonosDevices[0], volume: volume});
    	    gladys.music.setVolume({devicetype: sonosDevices[1], volume: volume});
    		gladys.music.flushQueue({devicetype: sonosDevices[0]});
    		gladys.music.playPlaylist({devicetype: sonosDevices[0], identifier: uri})
			.then(function(){
				console.log('Play uri playlist : ' + uri);
				resolve(1);
			});
		})
		.catch(() => {
    		console.error('Don\'t find the parameters ID Sonos in Gladys');
    		console.error('Create the parameters in Gladys : SONOS_MAIN_DEVICETYPE_ID and SONOS_SECONDARY_DEVICETYPE_ID');
    		reject(1);
        });
	});
};