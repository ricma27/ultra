const Promise = require('bluebird');

module.exports = function hueGetDevicesType(params){
	return new Promise(function(resolve, reject){
		var infoHue = {
        	binary: 0,
            brightness: 0,
            hue : 0,
            saturation: 0
        };
		gladys.deviceType.getByDevice({id: params.device})
    	.then(function(deviceType){
        	for(var i = 0; i < deviceType.length; i++){
            	if(deviceType[i].type == 'binary')
                	infoHue.binary = deviceType[i].id;
            	else if(deviceType[i].type == 'brightness')
                	infoHue.brightness = deviceType[i].id;
            	else if(deviceType[i].type == 'hue')
                	infoHue.hue = deviceType[i].id;
            	else if(deviceType[i].type == 'saturation')
                	infoHue.saturation = deviceType[i].id;
        		if((i === deviceType.length-1) && (infoHue.binary !== 0) && (infoHue.brightness !== 0) && (infoHue.hue !== 0) && (infoHue.saturation !== 0))
            		resolve(infoHue);
        	}
    	});
	});
};