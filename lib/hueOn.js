const Promise = require('bluebird');
var hueGetDevicesType = require('./hueGetDevicesType.js');

module.exports = function hueOn(idDevice, brightness, hue, saturation){
	return new Promise(function(resolve, reject){
		hueGetDevicesType(idDevice)
		.then((devicesType) => {
			var textlog = 'power on hue device : ' + idDevice;
			gladys.deviceType.exec({devicetype: devicesType.binary, value: 1});	
			if(typeof brightness != 'undefined'){
				gladys.deviceType.exec({devicetype: devicesType.brightness, value: brightness});
				textlog += ', brightness : ' + brightness;
			}
			if(typeof hue != 'undefined'){		
    			gladys.deviceType.exec({devicetype: devicesType.hue, value: hue});
				textlog += ', hue : ' + hue;
			}
			if(typeof saturation != 'undefined'){	
    			gladys.deviceType.exec({devicetype: devicesType.saturation, value: saturation});
				textlog += ', saturation : ' + saturation;
			}		
		});
	});
};