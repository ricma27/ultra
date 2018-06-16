module.exports = {
	relaunchFunction: true,
	isPlaying: false,
	trackQueuePosition: 0,
	trackSecondsPosition: 0,
	timerDeleteTrack: 0,
	newTrackPosition: 0,
	newTrackStatus: 0, // (0) no track add or playlist restarted, (1) track is playing, (2) track is deleting, (3) track deleted, (4) special condition for resolve deleteNewTrack function, (5) playlist is restarting
	isPlayingCorrection : false // necessary for correction of function getPlaying in Sonos because it's not enough reactive, the Sonos function put false even if music is playing when the music has just started
};