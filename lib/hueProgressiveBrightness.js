const Promise = require('bluebird');
var hueGetDevicesType = require('./hueGetDevicesType.js');
var hueOn = require('./hueOn.js');

module.exports = function hueProgressiveBrightness(params){
	return new Promise(function(resolve, reject){
		hueGetDevicesType(params)
		.then((devicesType) => {
			var stepBrightness = Math.floor(((params.brightnessEnd-params.brightnessStart)/(params.delay))+1);
			var nextStepBrightness = params.brightnessStart + stepBrightness;
			var delayMs = Math.floor((params.delay*1000)/Math.floor((params.brightnessEnd-params.brightnessStart)/stepBrightness));
			var totalState = Math.floor((params.delay*1000)/delayMs);
			var state = 1;
    		var wait = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, delayMs)});
    		if((params.brightnessEnd > params.brightnessStart) && params.delay > 0){
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
                		if((nextStepBrightness+stepBrightness) < params.brightnessEnd)
                    		nextStepBrightness += stepBrightness;
                		state += 1;
                		loopBrightness();
            		});
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
		});
	});
};