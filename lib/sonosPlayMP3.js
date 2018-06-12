const Promise = require('bluebird');
var shareSonos = require('./shareSonos');

module.exports = function sonosPlayMP3(fileName, volume){
	return new Promise(function(resolve, reject){
		Promise.all([gladys.param.getValue('SONOS_PRIMARY_DEVICETYPE_ID'), gladys.param.getValue('SONOS_SECONDARY_DEVICETYPE_ID')])
		.then((sonosDevices) => {
			var newTrackPosition;
			getInfoPlaying(sonosDevices[0])
			.then(function(){
				gladys.music.setVolume({devicetype: sonosDevices[0], volume: volume});
    	    	gladys.music.setVolume({devicetype: sonosDevices[1], volume: volume});
				return gladys.modules.sonos.music.play({uri: 'x-file-cifs://gladys/Partage/' + fileName, deviceType : {device : sonosDevices[0]}});
			})
			.then(function(){
    			return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : sonosDevices[0]}});
    		})
    		.then(function(currentTrack){
				shareSonos.lastAddTrackPosition = currentTrack.queuePosition;
	    		newTrackPosition = currentTrack.queuePosition;
    			console.log('Add new track Sonos : ' + fileName + ' (queue position : ' + newTrackPosition + ')');
    			currentTrack.duration = (currentTrack.duration*1000)+800;
    	    	var timer = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, currentTrack.duration)});
            	return timer();
    		})
    		.then(function(){
				if(newTrackPosition === shareSonos.lastAddTrackPosition){ // = not sonosPlayMp3 function was launched once again
					gladys.music.pause({devicetype: sonosDevices[0]});
					console.log('Remove track Sonos position :' + newTrackPosition);
    				gladys.modules.sonos.music.removeTrackFromQueue({trackNumber : newTrackPosition, deviceType : {device : sonosDevices[0]}})
			    	.then(function(){
						shareSonos.lastAddTrackPosition = 0;
    					gladys.music.setVolume({devicetype: sonosDevices[0], volume: 10});
    	    			gladys.music.setVolume({devicetype: sonosDevices[1], volume: 10});
    					if(shareSonos.trackQueuePosition !== 0){
    						gladys.modules.sonos.music.selectTrack({trackNumber : shareSonos.trackQueuePosition, deviceType : {device : sonosDevices[0]}})
    						.then(() => gladys.modules.sonos.music.seek({seconds : shareSonos.trackSecondsPosition, deviceType : {device : sonosDevices[0]}}))
    						.then(function(){
    							if(shareSonos.isPlaying){
    								gladys.music.play({devicetype: sonosDevices[0]})
    			    				.then(resolve(1));
                    			}
								else{
									resolve(1);
								}	
							});
						}
					});
				}	
        	});
    	});
    	
		var getInfoPlaying = (sonosPrimaryDeviceTypeID)=> new Promise((resolve, reject)=>{
			if(shareSonos.lastAddTrackPosition === 0){ // = function sonosPlayMp3 is not already running
				gladys.music.getPlaying({devicetype: sonosPrimaryDeviceTypeID})
	    		.then(function(result){
        			if(result.playing)
        	    		shareSonos.isPlaying = true;
    				else
        	    		shareSonos.isPlaying = false;
    				return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : sonosPrimaryDeviceTypeID}});
    			})
    			.then(function(currentTrack){
    	    		if(currentTrack.queuePosition !== 0){ // found a playlist
    					shareSonos.trackQueuePosition = currentTrack.queuePosition;
    					shareSonos.trackSecondsPosition = currentTrack.position;
    					console.log('Sonos music before : ' + currentTrack.title + ', position : ' + currentTrack.position + ' seconds' + ', is playing : ' + shareSonos.isPlaying);
    	    		}
    	    		else{
						console.log('no playlist Sonos selected !');
    					shareSonos.trackQueuePosition = 0;
    					shareSonos.trackSecondsPosition = 0;
    	    		}
					resolve(1);
				});
			}
			else{ // = already running, so take back the same parameters before function sonosReadMp3 was launched for the first time
				gladys.music.pause({devicetype: sonosDevices[0]});
				console.log('Remove track Sonos position :' + shareSonos.lastAddTrackPosition);
    			gladys.modules.sonos.music.removeTrackFromQueue({trackNumber : shareSonos.lastAddTrackPosition, deviceType : {device : sonosDevices[0]}});
				shareSonos.lastAddTrackPosition = 0;			
				resolve(1);
			}
		});
	});
};