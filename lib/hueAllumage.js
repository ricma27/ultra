const Promise = require('bluebird');

module.exports = function hueAllumage(idBinary, idBrightness, idHue, idSaturation, brightness, hue, saturation){
    gladys.deviceType.exec({devicetype: idBinary, value: 1});
    gladys.deviceType.exec({devicetype: idBrightness, value: brightness});
    gladys.deviceType.exec({devicetype: idHue, value: hue});
    return gladys.deviceType.exec({devicetype: idSaturation, value: saturation});
};