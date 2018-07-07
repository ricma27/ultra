var exec = require('child_process').exec;

module.exports = function systemShutdown(){
	exec('sudo halt');
};