const Promise = require('bluebird');
var hueGetDevicesType = require('./hueGetDevicesType.js');
var hueOn = require('./hueOn.js');

module.exports = function hueRegressiveBrightness(params){
	return new Promise(function(resolve, reject){
		hueGetDevicesType(params)
		.then((devicesType) => {
			var stepBrightness = Math.floor(((params.brightnessStart-params.brightnessEnd)/(params.delay))+1);
			var nextStepBrightness = params.brightnessStart - stepBrightness;
			var delayMs = Math.floor((params.delay*1000)/Math.floor((params.brightnessStart-params.brightnessEnd)/stepBrightness));
			var totalState = Math.floor((params.delay*1000)/delayMs);
			var state = 1;
    		var wait = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, delayMs)});
    		if((params.brightnessStart > params.brightnessEnd) && params.delay > 0){
				console.log('Progressive brightness hue device : ' + params.device + ', start brightness : ' + params.brightnessStart + ', end brightness : ' + params.brightnessEnd + ', delay in seconds : ' + params.delay);
				hueOn({device: params.device, brightness: params.brightnessStart})
				.then(() => {
        			loopBrightness();
				});
    		}
    		function loopBrightness(){
        		if(state < totalState){
            		wait()
					.then(() => {
                		gladys.deviceType.exec({devicetype: devicesType.brightness, value: nextStepBrightness});
                		if((nextStepBrightness-stepBrightness) > params.brightnessEnd)
                    		nextStepBrightness -= stepBrightness;
                		state += 1;
                		loopBrightness();
            		});
        		}
        		else{
					if(params.brightnessEnd === 0){
						if(nextStepBrightness !== params.brightnessEnd){
                			wait()
							.then(() => {
                    			gladys.deviceType.exec({devicetype: devicesType.brightness, value: params.brightnessEnd});
								gladys.deviceType.exec({devicetype: devicesType.binary, value: 0});
                    			resolve(1);
                			});
            			}
						else{
							gladys.deviceType.exec({devicetype: devicesType.binary, value: 0});
							resolve(1);
						}	
					}
					else{
            			if(nextStepBrightness !== params.brightnessEnd){
                			wait()
							.then(() => {
                    			gladys.deviceType.exec({devicetype: devicesType.brightness, value: params.brightnessEnd});
                    			resolve(1);
                			});
            			}
            			else
                			resolve(1);
					}
        		}
    		}
		});
	});
};