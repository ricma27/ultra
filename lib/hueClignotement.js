const Promise = require('bluebird');
var hueAllumage = require('./hueAllumage.js');

module.exports = function(idBinary, idBrightness, idHue, idSaturation, brightness, hue, saturation, dureeSecondes){
	return hueClignotement(idBinary, idBrightness, idHue, idSaturation, brightness, hue, saturation, dureeSecondes);
};

var hueClignotement = (idBinary, idBrightness, idHue, idSaturation, brightness, hue, saturation, dureeSecondes)=> new Promise((resolve, reject)=>{
    var lampeAllumee = true;
    var delaiChangementEtat = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 1000)}); //chaque seconde
    var changementEtat = 1;
    if(dureeSecondes > 0){
        hueAllumage(idBinary, idBrightness, idHue, idSaturation, brightness, hue, saturation);
        loopClignotement();
    }
    function loopClignotement(){
        if(changementEtat <= dureeSecondes){
            delaiChangementEtat().then(function(){
                if(lampeAllumee){
                    gladys.deviceType.exec({devicetype: idBinary, value: 0});
                    lampeAllumee = false;
                }
                else{
                    gladys.deviceType.exec({devicetype: idBinary, value: 1});
                    lampeAllumee = true;
                }
                changementEtat += 1;
                loopClignotement();
            });
        }
        else
            resolve(1);
    }
});