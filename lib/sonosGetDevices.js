const Promise = require('bluebird');

module.exports = function sonosGetDevices(){
	return new Promise(function(resolve, reject){
		var sonosDevices = new Array(0, 0);
		var textInfoSecondDevice = 'If you use a grouping of two Sonos, create also the parameter in Gladys : SECONDARY_SONOS_DEVICE';
		gladys.param.getValue('MAIN_SONOS_DEVICE')
		.then((mainSonosDevice) => {
			if(typeof mainSonosDevice == 'undefined' ||  mainSonosDevice == null){
				console.error('Find the parameter in Gladys : MAIN_SONOS_DEVICE but it doesn\'t have a valid value\n' + textInfoSecondDevice);
				reject(1);
			}
			else{
				sonosDevices[0] = mainSonosDevice;
				gladys.param.getValue('SECONDARY_SONOS_DEVICE')
				.then((secondSonosDevice) => {
					if(typeof secondSonosDevice == 'undefined' ||  secondSonosDevice == null){
						console.error('Find the parameter in Gladys : SECONDARY_SONOS_DEVICE but it doesn\'t have a valid value');
						reject(1);
					}
					else{
						sonosDevices[1] = secondSonosDevice;
						resolve(sonosDevices);
					}		
				})
				.catch(() => {
					resolve(sonosDevices);
				});
			}
		})	
		.catch(() => {
			console.error('Don\'t find the parameter ID Sonos\nCreate the parameter in Gladys : MAIN_SONOS_DEVICE\n' + textInfoSecondDevice);
			reject(1);
		});
	});
};