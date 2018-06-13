const Promise = require('bluebird');
var shareSonos = require('./shareSonos');

module.exports = function sonosPlayMP3(mainSonosDevice, secondSonosDevice, fileName, volume){
	return new Promise(function(resolve, reject){
		if(shareSonos.newTrackState === 1) // previous new track not yet loaded
			reject(1);
		else{
			var trackPosition = 0;
			getInfoPlaying(mainSonosDevice)
			.then(function(){
				gladys.music.setVolume({devicetype: mainSonosDevice, volume: volume});
    	    	gladys.music.setVolume({devicetype: secondSonosDevice, volume: volume});
				return gladys.modules.sonos.music.play({uri: 'x-file-cifs://gladys/Partage/' + fileName, deviceType : {device : mainSonosDevice}});
			})
			.then(function(){			
    			return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : mainSonosDevice}});
    		})
    		.then(function(currentTrack){
				shareSonos.newTrackPosition = currentTrack.queuePosition;
				trackPosition = shareSonos.newTrackPosition;
				shareSonos.newTrackState = 2; // new track loaded
    			console.log('Add new track Sonos : ' + fileName + ' (queue position : ' + shareSonos.newTrackPosition + ')');
    			currentTrack.duration = (currentTrack.duration*1000)+500;
    	    	var timer1 = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, currentTrack.duration)});
            	return timer1();
    		})
    		.then(function(){
				if(trackPosition === shareSonos.newTrackPosition){ // = not sonosPlayMp3 function was launched once again
					shareSonos.newTrackState = 3; // deletion in progress
					gladys.music.pause({devicetype: mainSonosDevice});
					console.log('Remove track Sonos position :' + shareSonos.newTrackPosition);
    				gladys.modules.sonos.music.removeTrackFromQueue({trackNumber : shareSonos.newTrackPosition, deviceType : {device : mainSonosDevice}})
			    	.then(function(){
						shareSonos.newTrackPosition = 0;
    					gladys.music.setVolume({devicetype: mainSonosDevice, volume: 10});
    	    			gladys.music.setVolume({devicetype: secondSonosDevice, volume: 10});
    					if(shareSonos.trackQueuePosition !== 0){
    						gladys.modules.sonos.music.selectTrack({trackNumber : shareSonos.trackQueuePosition, deviceType : {device : mainSonosDevice}})
    						.then(() => gladys.modules.sonos.music.seek({seconds : shareSonos.trackSecondsPosition, deviceType : {device : mainSonosDevice}}))
    						.then(function(){
								if(shareSonos.newTrackState === 3){
    								if(shareSonos.isPlaying){
    									gladys.music.play({devicetype: mainSonosDevice})
										.then(function(){
											shareSonos.newTrackState = 0;
											shareSonos.isPlayingCorrection = true;
											var timer2 = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 2000)});
											timer2()
											.then(function(){
												shareSonos.isPlayingCorrection = false;
											});
											resolve(1);
										});
                    				}
									else{
										gladys.music.pause({devicetype: mainSonosDevice})
    			    					.then(function(){
											shareSonos.newTrackState = 0;
											resolve(1);
										});
									}
								}	
							});
						}
					});
				}	
        	});
    	}
	});
};

var getInfoPlaying = (sonosPrimaryDeviceTypeID)=> new Promise((resolve, reject)=>{
	if(shareSonos.newTrackState === 0){ // = function sonosPlayMp3 is not already running
		shareSonos.newTrackState = 1; // new track is loading
		gladys.music.getPlaying({devicetype: sonosPrimaryDeviceTypeID})
		.then(function(result){
			if(result.playing || shareSonos.isPlayingCorrection)
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
	else if(shareSonos.newTrackState === 2){ // the previous new track is already loaded
		shareSonos.newTrackState = 1; // new track is loading
		gladys.music.pause({devicetype: sonosPrimaryDeviceTypeID});
		console.log('Remove track Sonos position :' + shareSonos.newTrackPosition);
		gladys.modules.sonos.music.removeTrackFromQueue({trackNumber : shareSonos.newTrackPosition, deviceType : {device : sonosPrimaryDeviceTypeID}});
		shareSonos.newTrackPosition = 0;			
		resolve(1);
	}
	else
		shareSonos.newTrackState = 1; // new track is loading
});