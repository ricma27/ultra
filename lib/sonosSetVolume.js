const Promise = require('bluebird');

module.exports = function sonosSetVolume(volume, arrayDevicesIDSonos){
	if(typeof volume != 'undefined'){
		if(volume >100)
			volume = 100;
		else if(volume < 0)
			volume = 0;
		if(arrayDevicesIDSonos[0] !== 0)
			gladys.music.setVolume({devicetype: arrayDevicesIDSonos[0], volume: volume});
		if(arrayDevicesIDSonos[1] !== 0)
			gladys.music.setVolume({devicetype: arrayDevicesIDSonos[1], volume: volume});
	}
};