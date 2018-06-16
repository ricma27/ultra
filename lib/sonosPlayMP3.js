const Promise = require('bluebird');
var shareSonos = require('./shareSonos');

module.exports = function sonosPlayMP3(fileName, volume){
	return new Promise(function(resolve, reject){
		if(!shareSonos.relaunchFunction){
			reject('Function relaunched too fast, the previous new track has not been loaded yet');
		}
		else{
			shareSonos.relaunchFunction = false;
			Promise.all([gladys.param.getValue('SONOS_MAIN_DEVICETYPE_ID'), gladys.param.getValue('SONOS_SECONDARY_DEVICETYPE_ID')])
			.then((sonosDevices)=>{
    			getInfoPlaying(sonosDevices[0])
				.then(() => playNewTrackEndQueue(fileName, volume, sonosDevices))
				.then(() => deleteNewTrack(shareSonos.newTrackPosition, sonosDevices[0]))
				.then(() => restartingPlaylist(volume, sonosDevices))
				.then(() => resolve(1));
			})
			.catch(() => {
    			shareSonos.relaunchFunction = true;		
				reject('Don\'t find the parameter ID Sonos\nCreate the parameter in Gladys : SONOS_MAIN_DEVICETYPE_ID\nIf you use a grouping of two Sonos, create also the parameter in Gladys : SONOS_SECONDARY_DEVICETYPE_ID');
            });
		}
	});
};

var getInfoPlaying = (sonosPrimaryDeviceTypeID)=> new Promise((resolve, reject)=>{
	if(shareSonos.newTrackStatus === 0){ // no track add yet
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
				console.log('No playlist Sonos selected !');
				shareSonos.trackQueuePosition = 0;
				shareSonos.trackSecondsPosition = 0;
    		}
			resolve(1);
		});
	}
	else if(shareSonos.newTrackStatus === 1){ // previous new track is playing
		clearTimeout(shareSonos.timerDeleteTrack);
		gladys.music.pause({devicetype: sonosPrimaryDeviceTypeID});
		shareSonos.newTrackStatus = 4; // special condition for resolve deleteNewTrack function
		deleteNewTrack(shareSonos.newTrackPosition, sonosPrimaryDeviceTypeID)
		.then(() => resolve(1));
	}
	else if(shareSonos.newTrackStatus === 2){ // previous new track is deleting
		gladys.music.pause({devicetype: sonosPrimaryDeviceTypeID});
		waitSonosResponse(3, 1000)
		.then(() => resolve(1));
	}
	else if(shareSonos.newTrackStatus === 5){ // playList is restarting
		gladys.music.pause({devicetype: sonosPrimaryDeviceTypeID});
		waitSonosResponse(0, 1000)
		.then(() => resolve(1));
	}
});

var playNewTrackEndQueue = (fileName, volume, arrayDevicesIDSonos)=> new Promise((resolve, reject)=>{
	setVolume(volume, arrayDevicesIDSonos);
	gladys.modules.sonos.music.getQueue({deviceType : {device : arrayDevicesIDSonos[0]}})
	.then((info) => {	
		shareSonos.newTrackPosition = info.length+1;
    	return gladys.modules.sonos.music.queue({uri: 'x-file-cifs://gladys/Partage/' + fileName, positionInQueue: shareSonos.newTrackPosition, deviceType : {device : arrayDevicesIDSonos[0]}});
	})
    .then(function(){
		shareSonos.newTrackStatus = 1; // track is playing
		shareSonos.relaunchFunction = true;
		gladys.music.play({devicetype: arrayDevicesIDSonos[0]});
		return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : arrayDevicesIDSonos[0]}});
	})		
	.then(function(currentTrack){
    	console.log('Add new track Sonos : ' + fileName + ' (queue position : ' + shareSonos.newTrackPosition + ')');
        currentTrack.duration = (currentTrack.duration*1000)+800;
		shareSonos.timerDeleteTrack = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, currentTrack.duration)});
        return shareSonos.timerDeleteTrack();
	})
	.then(() => resolve(1));
});

var setVolume = function(volume, arrayDevicesIDSonos){
	gladys.music.setVolume({devicetype: arrayDevicesIDSonos[0], volume: volume});
	if(typeof arrayDevicesIDSonos[1] != 'undefined'){
		gladys.music.setVolume({devicetype: arrayDevicesIDSonos[1], volume: volume});
	}	
};

var waitSonosResponse = (valueStatusVerified, waitTimeMax)=> new Promise((resolve, reject)=>{
    var endLoop = false;
	var timerWaitEndDeletion = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, waitTimeMax)});
	timerWaitEndDeletion()
	.then(function(){
		endLoop = true;
	});
	var checkDeletionInterval = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 50)});		
	var loopWaitEndDeletion = ()=> new Promise((resolve, reject)=>{
		checkDeletionInterval()
		.then(function(){
			if(!endLoop){
				if(shareSonos.newTrackStatus === valueStatusVerified)
					resolve(1);
				else
					loopWaitEndDeletion();
			}
			else
				reject(1);
		});
	});
	loopWaitEndDeletion()
	.then(() => resolve(1))
	.catch(function(){
		shareSonos.relaunchFunction = true;	
		reject('Error add new track due to a no response of sonos in the time limit');
	});
});

var deleteNewTrack = (queuePosition, sonosPrimaryDeviceTypeID)=> new Promise((resolve, reject)=>{
	if(shareSonos.newTrackStatus !== 4)
		shareSonos.newTrackStatus = 2;
	console.log('Remove track Sonos position :' + queuePosition);
	gladys.modules.sonos.music.removeTrackFromQueue({trackNumber : queuePosition, deviceType : {device : sonosPrimaryDeviceTypeID}})
	.then(function(){
		if(shareSonos.relaunchFunction || shareSonos.newTrackStatus === 4){
			shareSonos.newTrackStatus = 3; // track deleted
			resolve(1);
		}
		else
			reject('cancel function restartingPlaylist() because a new track has just been added');
	});
});

var restartingPlaylist = (volume, arrayDevicesIDSonos)=> new Promise((resolve, reject)=>{
	shareSonos.newTrackStatus = 5; // playlist is restarting
	setVolume(10, arrayDevicesIDSonos);
    if(shareSonos.trackQueuePosition !== 0){ // playlist exists
    	gladys.modules.sonos.music.selectTrack({trackNumber : shareSonos.trackQueuePosition, deviceType : {device : arrayDevicesIDSonos[0]}})
        .then(() => gladys.modules.sonos.music.seek({seconds : shareSonos.trackSecondsPosition, deviceType : {device : arrayDevicesIDSonos[0]}}))
        .then(function(){
			shareSonos.newTrackStatus = 0; // playlist restarted
        	if(shareSonos.isPlaying){
        		gladys.music.play({devicetype: arrayDevicesIDSonos[0]})
        		.then(function(){
        			shareSonos.isPlayingCorrection = true;
        			var timerIsPlaying = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, 2000)});
        			timerIsPlaying()
        			.then(function(){
        				shareSonos.isPlayingCorrection = false;
        			});
        			resolve(1);
        		});
    		}
        	else{
        		gladys.music.pause({devicetype: arrayDevicesIDSonos[0]})
				.then(() => resolve(1));
        	}	
        });
	}
});