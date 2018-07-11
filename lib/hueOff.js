var hueGetDevicesType = require('./hueGetDevicesType.js');

module.exports = function hueOff(params){
	return hueGetDevicesType(params)
	.then((devicesType) => {
		console.log('Power off hue device : ' + params.device);
		return gladys.deviceType.exec({devicetype: devicesType.binary, value: 0});
	});
};