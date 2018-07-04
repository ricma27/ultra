const Promise = require('bluebird');

module.exports = function getRandomArrayElement(array){
	var randomChoice = randomInt(0, array.length-1);
	return(array[randomChoice]);
};

function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}