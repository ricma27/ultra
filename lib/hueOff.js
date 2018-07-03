const Promise = require('bluebird');
var hueGetDevicesType = require('./hueGetDevicesType.js');

module.exports = function hueOff(params){
	return new Promise(function(resolve, reject){
		hueGetDevicesType(params)
		.then((devicesType) => {
			var textlog = 'Power off hue device : ' + params.device;
			gladys.deviceType.exec({devicetype: devicesType.binary, value: 0});	
			console.log(textlog);
			resolve(1);
		});
	});
};