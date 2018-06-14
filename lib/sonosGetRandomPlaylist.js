const Promise = require('bluebird');

module.exports = function sonosGetRandomPlaylist(){
	return new Promise(function(resolve, reject){
		gladys.param.getValue('SONOS_MAIN_DEVICETYPE_ID')
    	.then((sonosDevice) => {
			gladys.music.getPlaylists({devicetype: sonosDevice})
			.then((infoPlaylist) => {
    			var randomChoice = randomInt(0, infoPlaylist.length-1);
				console.log('Random playlist : ' + infoPlaylist[randomChoice].title + ' (uri : ' + infoPlaylist[randomChoice].uri + ')');
				resolve(infoPlaylist[randomChoice]);
			});
    	})
		.catch(() => {
    		console.error('Don\'t find the parameter ID Sonos in Gladys');
    		console.error('Create the parameter in Gladys : SONOS_MAIN_DEVICETYPE_ID');
    		reject(1);
        });

		function randomInt(min, max){
    		return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	});
};