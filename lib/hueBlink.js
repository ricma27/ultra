const Promise = require('bluebird');
var hueGetDevicesType = require('./hueGetDevicesType.js');
var hueOn = require('./hueOn.js');

module.exports = function hueBlink(params){
	return new Promise(function(resolve, reject){
		hueGetDevicesType(params)
		.then((devicesType) => {
			var huePowerOn = true;
    		var wait = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 1000)}); // changeState 1 second
    		var changeState = 1;
    		if(params.delay > 0){
				console.log('Blinking hue device : ' + params.device + ', delay in seconds : ' + params.delay);
				hueOn({device: params.device, brightness: params.brightness, hue: params.hue, saturation: params.saturation})
				.then(() => {
        			loopBlink();
				});
    		}
			function loopBlink(){
            	if(changeState <= params.delay){
                	wait()
    				.then(() => {
                    	if(huePowerOn){
                        	gladys.deviceType.exec({devicetype: devicesType.binary, value: 0});
                        	huePowerOn = false;
                    	}
                    	else{
                        	gladys.deviceType.exec({devicetype: devicesType.binary, value: 1});
                        	huePowerOn = true;
                    	}
                    	changeState += 1;
                    	loopBlink();
                	});
            	}
            	else
                	resolve(1);
			}
		});
	});
};