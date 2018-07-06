var fse = require('fs-extra');

module.exports = function install(){
	fse.mkdirsSync(./cache/sound/);	
};