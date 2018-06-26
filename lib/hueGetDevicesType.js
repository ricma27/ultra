const Promise = require('bluebird');

module.exports = function hueGetDevicesType(IDHue){
	return new Promise(function(resolve, reject){
		var infoHue = {
        	binary: 0,
            brigthness: 0,
            hue : 0,
            saturation: 0
        };
		gladys.deviceType.getByDevice({id: IDHue})
    	.then(function(deviceType){
        	for(var i = 0; i < deviceType.length; i++){
            	if(deviceType[i].type == 'binary')
                	infoHue.binary = deviceType[i].id;
            	else if(deviceType[i].type == 'brightness')
                	infoHue.brigthness = deviceType[i].id;
            	else if(deviceType[i].type == 'hue')
                	infoHue.hue = deviceType[i].id;
            	else if(deviceType[i].type == 'saturation')
                	infoHue.saturation = deviceType[i].id;
        		if(i === deviceType.length-1)
            		resolve(infoHue);
        	}
    	});
	});
};