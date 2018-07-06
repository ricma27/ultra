var exec = require('child_process').exec;

module.exports = function reboot(){
	exec('sudo halt');
};