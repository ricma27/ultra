var exec = require('child_process').exec;

module.exports = function systemReboot(){
	exec('sudo reboot');
};