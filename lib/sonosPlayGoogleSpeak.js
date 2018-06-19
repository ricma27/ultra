var http = require('http');
var fs = require('fs');
var md5 = require('md5');
var sonosPlayMP3 = require('./sonosPlayMP3.js');

module.exports = function sonosGoogleSpeak(params){
	return new Promise(function(resolve, reject){
		download(params.language, params.text)
		.then((fileName) => sonosPlayMP3({fileName: fileName, volume: params.volume})
		.then(() => resolve(1));
	});

	function download(language, text){
		var options = {
			hostname: `translate.google.com`,
			path: `/translate_tts?tl=${language}&client=tw-ob&q=${encodeURIComponent(text)}`,
			method: 'GET',
			headers: {'user-agent': 'Mozilla/5.0'},
		};
		var fileName = md5(language + text) + '.mp3';
		var destination = './cache/sound/' + fileName;
		return new Promise(function(resolve, reject) {
			fs.exists(destination, function(exists) { 
				if (exists) { 
					console.log('Using cache, file already exists in folder : ./cache/sound');
					return resolve(fileName);
				}
				else {
					console.log('Downloading file : ' + fileName + ' in folder : ./cache/sound');
					var request = http.get(options, function(response) {
						if(response.statusCode >= 200 && response.statusCode < 300) {
							var file = fs.createWriteStream(destination);
							response.pipe(file);
							file.on('finish', function() {
								file.close();
							});
							file.on('close', function() {
								resolve(fileName);
							});
						}
						else {
							reject(new Error('Fail downloading'));
						}
					});
				}
			});
		});
	}	
};