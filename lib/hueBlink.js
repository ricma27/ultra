const Promise = require('bluebird');
var hueGetDevicesType = require('./hueGetDevicesType.js');

module.exports = function hueBlink(params){
	return new Promise(function(resolve, reject){
		hueGetDevicesType(params)
		.then((devicesType) => {
			var hueOn = true;
    		var wait = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 1000)}); // changeState 1 second
    		var changeState = 1;
    		if(params.delay > 0){
				console.log('Blinking hue device : ' + devicesType.binary + ', delay in seconds : ' + params.delay);
        		loopBlink();
    		}
			function loopBlink(){
            	if(changeState <= params.delay){
                	wait()
    				.then(() => {
                    	if(hueOn){
                        	gladys.deviceType.exec({devicetype: devicesType.binary, value: 0});
                        	hueOn = false;
                    	}
                    	else{
                        	gladys.deviceType.exec({devicetype: devicesType.binary, value: 1});
                        	hueOn = true;
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