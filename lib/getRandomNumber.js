module.exports = function getRandomNumber(params){
	return Math.floor(Math.random() * (params.max - params.min + 1)) + params.min;
};