var http = require('http');
var fs = require('fs');
var md5 = require('md5');
var sonosLireMp3 = require('./sonosLireMp3.js');

module.exports = function sonosLireGoogleSpeak(texte, volume){
	return new Promise(function(resolve, reject){
		download('fr', texte)
		.then(function(fileName){
			return sonosLireMp3(fileName, volume);
		})
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
					console.log('le fichier : ' + fileName + ' existe déja dans le dossier : ./cache/sound');
					return resolve(fileName);
				}
				else {
					console.log('téléchargement du fichier : ' + fileName + ' dans le dossier : ./cache/sound');
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