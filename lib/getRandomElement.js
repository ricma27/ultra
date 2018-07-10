var getRandomNumber = require('./getRandomNumber.js');

module.exports = function getRandomElement(array){
	return array[getRandomNumber({min: 0, max: array.length-1})];
};