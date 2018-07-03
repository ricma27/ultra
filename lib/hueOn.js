const Promise = require('bluebird');
var hueGetDevicesType = require('./hueGetDevicesType.js');

module.exports = function hueOn(params){
	return new Promise(function(resolve, reject){
		hueGetDevicesType(params)
		.then((devicesType) => {
			var textlog = 'Power on hue device : ' + params.device;
			gladys.deviceType.exec({devicetype: devicesType.binary, value: 1})
			if(typeof params.brightness != 'undefined'){
				gladys.deviceType.exec({devicetype: devicesType.brightness, value: params.brightness});
				textlog += ', brightness : ' + params.brightness;
			}
			if(typeof params.hue != 'undefined'){		
    			gladys.deviceType.exec({devicetype: devicesType.hue, value: params.hue});
				textlog += ', hue : ' + params.hue;
			}
			if(typeof params.saturation != 'undefined'){	
    			gladys.deviceType.exec({devicetype: devicesType.saturation, value: params.saturation});
				textlog += ', saturation : ' + params.saturation;
			}
			if(typeof params.delay != 'undefined'){
				textlog += ', delay in seconds before extinction : ' + params.delay;
				console.log(textlog);
				var delay = params.delay * 1000;
				var wait = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, delay)});
				wait()
				.then(() => gladys.deviceType.exec({devicetype: devicesType.binary, value: 0}))
				.then(() => resolve(1));
			}
			else{
				console.log(textlog);
				resolve(1);
			}
		});
	});
};