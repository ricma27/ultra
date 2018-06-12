const Promise = require('bluebird');
var hueAllumage = require('./hueAllumage.js');

module.exports = function(idBinary, idBrightness, idHue, idSaturation, luminositeMax, luminositeMin, hue, saturation, dureeSecondes){
	return hueIntensiteRegressive(idBinary, idBrightness, idHue, idSaturation, luminositeMax, luminositeMin, hue, saturation, dureeSecondes);
};

var hueIntensiteRegressive = (idBinary, idBrightness, idHue, idSaturation, luminositeMax, luminositeMin, hue, saturation, dureeSecondes)=> new Promise((resolve, reject)=>{
    var minDecrementationLuminosite = Math.floor(((luminositeMax-luminositeMin)/(dureeSecondes))+1);
    var intensiteLumineuse = luminositeMax - minDecrementationLuminosite;
    var palierMS = Math.floor((dureeSecondes*1000)/Math.floor((luminositeMax-luminositeMin)/minDecrementationLuminosite));
    var totalChangementEtat = Math.floor((dureeSecondes*1000)/palierMS);
    var changementEtat = 1;
    var delaiPalierMs = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, palierMS)});
	if((luminositeMax > luminositeMin) && (dureeSecondes > 0)){
		hueAllumage(idBinary, idBrightness, idHue, idSaturation, luminositeMax, hue, saturation);
        loopLuminosite();
    }
    function loopLuminosite(){
        if(changementEtat < totalChangementEtat){
            delaiPalierMs().then(function(){
                gladys.deviceType.exec({devicetype: idBrightness, value: intensiteLumineuse});
                if((intensiteLumineuse-minDecrementationLuminosite) > luminositeMin)
                    intensiteLumineuse -= minDecrementationLuminosite;
                changementEtat += 1;
                loopLuminosite();
            });
        }
        else{
			if(luminositeMin === 0){
				if(intensiteLumineuse !== luminositeMin){
                	delaiPalierMs().then(function(){
                    	gladys.deviceType.exec({devicetype: idBrightness, value: luminositeMin});
						gladys.deviceType.exec({devicetype: idBinary, value: 0});
                    	resolve(1);
                	});
            	}
				else{
					gladys.deviceType.exec({devicetype: idBinary, value: 0});
					resolve(1);
				}	
			}
			else{
            	if(intensiteLumineuse !== luminositeMin){
                	delaiPalierMs().then(function(){
                    	gladys.deviceType.exec({devicetype: idBrightness, value: luminositeMin});
                    	resolve(1);
                	});
            	}
            	else
                	resolve(1);
			}
        }
    }
});