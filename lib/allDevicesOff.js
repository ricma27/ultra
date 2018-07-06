const Promise = require('bluebird');
var sonosGetDevices = require('./sonosGetDevices.js');
var exec = require('child_process').exec;

module.exports = function allDevicesOff(params){
	return new Promise(function(resolve, reject){
		if(typeof params.exceptSonos == 'undefined')
			params.exceptSonos = false;
		if(typeof params.exceptHue == 'undefined')
			params.exceptHue = false;	
		if(!params.exceptSonos == true)
			sonosOff();
		if(!params.exceptHue == true)			
			hueAllDevicesOff();
		if(!params.exceptTv == true)			
			tvOff().then(() => resolve(1));
	});
};

function hueAllDevicesOff(){
	return new Promise(function(resolve, reject){
		hueGetAllDevice()
		.then((hueDevices) => {
			for(var i = 0; i < hueDevices.length; i++){
				hueGetBinary(hueDevices[i])
				.then((idBinary) => {
					gladys.deviceType.exec({devicetype: idBinary, value: 0});
					console.log('Power off Hue device : ' + idBinary);
				});
				if(i === hueDevices.length-1)
					resolve(1);
        	}
		});
	});
}

function hueGetAllDevice(){
	return new Promise(function(resolve, reject){
		var arrayHueDevices = [];
		gladys.device.getByService({service: 'hue'})
    	.then((devicesType) => {
    		for(var i = 0; i < devicesType.length; i++){
				arrayHueDevices.push(devicesType[i].id);
            	if(i === devicesType.length-1)
					resolve(arrayHueDevices);
        	}
    	});
	});
}

function hueGetBinary(hueIDDevice){
	return new Promise(function(resolve, reject){
		gladys.deviceType.getByDevice({id: hueIDDevice})
    	.then((deviceType) => {
    		for(var i = 0; i < deviceType.length; i++){
            	if(deviceType[i].type == 'binary')
					resolve(deviceType[i].id);
        	}
    	});
	});
}

function sonosOff(){
	return new Promise(function(resolve, reject){
		sonosGetDevices()
    	.then((sonosDevices) => {
			gladys.music.pause({devicetype: sonosDevices[0]}).then(() => resolve(1));
    	});
	});
}

function tvOff(){
	return new Promise(function(resolve, reject){
		exec('echo "standby 0" | cec-client RPI -s')
		.then(() => resolve(1));
	});
}