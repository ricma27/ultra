module.exports = {
	isPlaying:false,
	trackQueuePosition: 0,
	trackSecondsPosition: 0,
	newTrackState: 0,
	newTrackPosition: 0,
	isPlayingCorrection : false // necessary for correction of function getPlaying in Sonos because it's not enough reactive, the Sonos function put false even if music is playing when the music has just started
};