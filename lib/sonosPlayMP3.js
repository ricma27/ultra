const Promise = require('bluebird');
var sonosShare = require('./sonosShare');
var sonosGetDevices = require('./sonosGetDevices.js');
var sonosSetVolume = require('./sonosSetVolume.js');

module.exports = function sonosPlayMP3(params){
	return new Promise(function(resolve, reject){
		if(!sonosShare.relaunchFunction){
			console.error('Function relaunched too fast, the previous new track has not been loaded yet');
			reject(1);
		}
		else{
			sonosGetDevices()
			.then((sonosDevices) => {
				sonosShare.relaunchFunction = false;
    			getInfoPlaying(sonosDevices)
				.then(() => playNewTrackEndQueue(params.fileName, params.volume, params.stop, sonosDevices))
				.then(() => deleteNewTrack(sonosShare.newTrackPosition, sonosDevices))
				.then(() => restartingPlaylist(params.volume, sonosDevices))
				.then(() => resolve(1));
			});
		}
	});
};

var getInfoPlaying = (arrayDevicesIDSonos) => new Promise((resolve, reject)=>{
	if(sonosShare.newTrackStatus === 0){ // no track add yet
		gladys.music.getPlaying({devicetype: arrayDevicesIDSonos[0]})
		.then((result) => {
			if(result.playing || sonosShare.isPlayingCorrection)
	    		sonosShare.isPlaying = true;		
			else
	    		sonosShare.isPlaying = false;
			return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : arrayDevicesIDSonos[0]}});
		})
		.then((currentTrack) => {
    		if(currentTrack.queuePosition !== 0){ // found a playlist
				sonosShare.trackQueuePosition = currentTrack.queuePosition;
				sonosShare.trackSecondsPosition = currentTrack.position;
				console.log('------------------------------------------------------------------------------------------------------');
				console.log('Sonos music before : ' + currentTrack.title + ', position : ' + currentTrack.position + ' seconds' + ', is playing : ' + sonosShare.isPlaying);
    		}
    		else{
				console.log('Empty playlist !');
				sonosShare.trackQueuePosition = 0;
				sonosShare.trackSecondsPosition = 0;
    		}
			resolve(1);
		});
	}
	else if(sonosShare.newTrackStatus === 1){ // previous new track is playing
		sonosShare.newTrackStatus = 4; // special condition for resolve deleteNewTrack function
		sonosShare.timerDeleteTrack.cancel();
		gladys.music.pause({devicetype: arrayDevicesIDSonos[0]});
		deleteNewTrack(sonosShare.newTrackPosition, arrayDevicesIDSonos[0])
		.then(() => resolve(1));
	}
	else if(sonosShare.newTrackStatus === 2){ // previous new track is deleting
		waitSonosResponse(3, 1000)
		.then(() => resolve(1));
	}
	else if(sonosShare.newTrackStatus === 5){ // playList is restarting
		waitSonosResponse(0, 1000)
		.then(() => resolve(1));
	}
});

var playNewTrackEndQueue = (fileName, volume, stop, arrayDevicesIDSonos) => new Promise((resolve, reject)=>{
	var stopTrackBeforeEnd = false;
    addNewTrackEndQueue(fileName, arrayDevicesIDSonos)
    .then(() => gladys.modules.sonos.music.selectTrack({trackNumber : sonosShare.newTrackPosition, deviceType : {device : arrayDevicesIDSonos[0]}}))			
	.then(() => sonosSetVolume(volume, arrayDevicesIDSonos))
	.then(() => {
		gladys.music.play({devicetype: arrayDevicesIDSonos[0]});
		return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : arrayDevicesIDSonos[0]}});
	})
	.then((currentTrack) => {
    	console.log('Add new track Sonos : ' + fileName + ' (end queue position : ' + sonosShare.newTrackPosition + ')');
		if(currentTrack.duration === 0)
			currentTrack.duration = 1;
		if(typeof stop != 'undefined'){
			if((stop > 0) && (stop < currentTrack.duration)){
				currentTrack.duration = stop;
				stopTrackBeforeEnd = true;
			}
		}	
        currentTrack.duration *= 1000;
		sonosShare.timerDeleteTrack = timeout(currentTrack.duration);
		sonosShare.newTrackStatus = 1; // track is playing
		sonosShare.relaunchFunction = true;
		sonosShare.timerDeleteTrack.promise	
		.then(() => waitEndTrack(arrayDevicesIDSonos[0], 3000))
		.then(() => resolve(1));
	});
	
	var waitEndTrack = (arrayDevicesIDSonos, waitTimeMax) => new Promise((resolve, reject)=>{
		if(stopTrackBeforeEnd)
			gladys.music.pause({devicetype: arrayDevicesIDSonos[0]});	
        var endLoop = false;
    	var timerWaitEndTrack = () => new Promise((resolve, reject) => {setTimeout(resolve, waitTimeMax)});
    	timerWaitEndTrack()
    	.then(() => {
    		endLoop = true;
    	});
    	var checkEndTrackInterval = () => new Promise((resolve, reject) => {setTimeout(resolve, 50)});	
    	var loopWaitEndTrack = function(){
    		if(!endLoop && sonosShare.relaunchFunction){
    		    gladys.music.getPlaying({devicetype: arrayDevicesIDSonos[0]})
    		    .then((result) => {
    			    if(!result.playing && sonosShare.relaunchFunction)
    	    		    resolve(1);
    	    	    else{
                        checkEndTrackInterval()
    		            .then(() => {
    	    	            loopWaitEndTrack();
    		            });
    	    	    }
    		    });
    		}
    		else
    		    reject(9);
    	};
    	loopWaitEndTrack();
    });
});

var addNewTrackEndQueue = (fileName, arrayDevicesIDSonos) => new Promise((resolve, reject)=>{
	var lookPositionEndQueue = (arrayDevicesIDSonos) => new Promise((resolve, reject)=>{
        if(sonosShare.trackQueuePosition === 0){ // empty playlist
		    sonosShare.newTrackPosition = 1;
    	    resolve(1);
        }
        else{
            gladys.modules.sonos.music.getQueue({deviceType : {device : arrayDevicesIDSonos[0]}})
	        .then((info) => {
		        sonosShare.newTrackPosition = info.length+1;
    	        resolve(1);
	        });
        }
	});
	lookPositionEndQueue(arrayDevicesIDSonos)
	.then(() => gladys.modules.sonos.music.queue({uri: 'x-file-cifs://gladys/Partage/' + fileName, positionInQueue: sonosShare.newTrackPosition, deviceType : {device : arrayDevicesIDSonos[0]}}))
    .then(() => resolve(1))
	.catch(() => {
		sonosShare.relaunchFunction = true;
		console.error('Error add MP3 track in Sonos');
	});
});

var waitSonosResponse = (valueStatusVerified, waitTimeMax) => new Promise((resolve, reject)=>{
    var endLoop = false;
	var timerWaitEndDeletion = () => new Promise((resolve, reject) => {setTimeout(resolve, waitTimeMax)});
	timerWaitEndDeletion()
	.then(() => {
		endLoop = true;
	});
	var checkDeletionInterval = () => new Promise((resolve, reject) => {setTimeout(resolve, 50)});		
	var loopWaitEndDeletion = function(){
		checkDeletionInterval()
		.then(() => {
			if(!endLoop){
				if(sonosShare.newTrackStatus === valueStatusVerified)		
					resolve(1);
				else
					loopWaitEndDeletion();
			}
			else{
				sonosShare.relaunchFunction = true;
				sonosShare.newTrackStatus = 0;
				console.error('Error add new track due to a no response of sonos in the time limit');
				reject(5);
			}	
		});
	};
	loopWaitEndDeletion();
});

var deleteNewTrack = (queuePosition, arrayDevicesIDSonos)=> new Promise((resolve, reject)=>{
	if(sonosShare.newTrackStatus !== 4)
		sonosShare.newTrackStatus = 2;
	console.log('Remove track Sonos position : ' + queuePosition);
	gladys.modules.sonos.music.removeTrackFromQueue({trackNumber : queuePosition, deviceType : {device : arrayDevicesIDSonos[0]}})
	.then(() => {
		if(sonosShare.relaunchFunction || sonosShare.newTrackStatus === 4){
			sonosShare.newTrackStatus = 3; // track deleted
			resolve(1);
		}
		else{
			console.log('cancellation of the function restartingPlaylist() because a new track has just been added');
			reject(6);
		}
	})
	.catch(() => {
		sonosShare.relaunchFunction = true;
		console.error('No more track to remove at the position : ' + queuePosition);
		reject(7);
	});
});

var restartingPlaylist = (volume, arrayDevicesIDSonos)=> new Promise((resolve, reject)=>{
	sonosShare.newTrackStatus = 5; // playlist is restarting
	sonosSetVolume(15, arrayDevicesIDSonos)
	.then(() => {
        if(sonosShare.trackQueuePosition !== 0){ // playlist exists
        	gladys.modules.sonos.music.selectTrack({trackNumber : sonosShare.trackQueuePosition, deviceType : {device : arrayDevicesIDSonos[0]}})
            .then(() => gladys.modules.sonos.music.seek({seconds : sonosShare.trackSecondsPosition, deviceType : {device : arrayDevicesIDSonos[0]}}))
            .then(() => {
    			sonosShare.newTrackStatus = 0; // playlist restarted
    			if(sonosShare.relaunchFunction){
    				console.log('Put the original playlist back');
    				console.log('------------------------------------------------------------------------------------------------------');
            		if(sonosShare.isPlaying){
            			gladys.music.play({devicetype: arrayDevicesIDSonos[0]})
            			.then(() => {
            				sonosShare.isPlayingCorrection = true;
            				var timerIsPlaying = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 2000)});
            				timerIsPlaying()
            				.then(() => {
            					sonosShare.isPlayingCorrection = false;
            				});
            				resolve(1);
            			});
        			}
            		else
    					resolve(1);
    			}		
            });
    	}
    	else{
    		sonosShare.newTrackStatus = 0; // no track add yet
    		console.log('Put the empty playlist back');
    		console.log('------------------------------------------------------------------------------------------------------');
    	}
	});
});

function timeout(ms) {
  var timeout, promise;
  promise = new Promise(function(resolve, reject){
    timeout = setTimeout(function() {
      resolve(1);
    }, ms);
  }); 
  return{
  	promise:promise, 
    cancel:function(){clearTimeout(timeout );} //return a canceller as well
  };
}