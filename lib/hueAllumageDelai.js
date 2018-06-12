const Promise = require('bluebird');
var hueAllumage = require('./hueAllumage.js');

module.exports = function hueAllumageDelai(idBinary, idBrightness, idHue, idSaturation, brightness, hue, saturation, delaiSecondes){
	return new Promise(function(resolve, reject){    
		delaiSecondes *= 1000;
		var delai = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, delaiSecondes)});
		hueAllumage(idBinary, idBrightness, idHue, idSaturation, brightness, hue, saturation)
		.then(() => delai())
		.then(() => gladys.deviceType.exec({devicetype: idBinary, value: 0}))
		.then(() => resolve(1));
    });
};