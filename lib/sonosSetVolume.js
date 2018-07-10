const Promise = require('bluebird');

module.exports = function sonosSetVolume(volume, arrayDevicesIDSonos){
	return new Promise(function(resolve, reject){
		if(typeof volume != 'undefined'){
			if(volume >100)
				volume = 100;
			else if(volume < 0)
				volume = 0;
			if(arrayDevicesIDSonos[0] !== 0){
				gladys.music.setVolume({devicetype: arrayDevicesIDSonos[0], volume: volume})
				.then(() => {
					if(arrayDevicesIDSonos[1] !== 0){
						gladys.music.setVolume({devicetype: arrayDevicesIDSonos[1], volume: volume})
						.then(() => resolve(1));
					}
				});
			}		
			else if(arrayDevicesIDSonos[1] !== 0){
				gladys.music.setVolume({devicetype: arrayDevicesIDSonos[1], volume: volume})
				.then(() => resolve(1));	
			}
			else
				reject(new Error('The arrayDevicesSonos is set to 0'));
		}
		else
			reject(new Error('The volume parameter is missing'));
	});
};