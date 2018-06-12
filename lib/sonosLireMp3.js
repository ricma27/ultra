const Promise = require('bluebird');
var variablesPartagees = require('./variablesPartagees');

module.exports = function sonosLireMp3(nomFichier, volumeSonos){
	return new Promise(function(resolve, reject){
		var pisteRechercheInfos;
		var positionPisteAjoutee;
		if(variablesPartagees.positionsPistesSonos.length === 0)
			pisteRechercheInfos = true;
		else
			pisteRechercheInfos = false;
    	var sonosPrincipal, sonosAuxiliaire;
    	gladys.param.getValue('SONOS_DEVICE_PRINCIPAL')
    	.then((sonosDevicePrincipal) => {
    	    sonosPrincipal = sonosDevicePrincipal
    		return gladys.param.getValue('SONOS_DEVICE_AUXILIAIRE');
    	})
    	.then((sonosDeviceAuxiliaire) => {
    	    sonosAuxiliaire = sonosDeviceAuxiliaire;
			return obtenirInfosPisteActuelle(pisteRechercheInfos);
		})
    	.then(function(){
    		gladys.music.setVolume({devicetype: sonosPrincipal, volume: volumeSonos});
    	    gladys.music.setVolume({devicetype: sonosAuxiliaire, volume: volumeSonos});
    	    return gladys.modules.sonos.music.play({uri: 'x-file-cifs://gladys/Partage/' + nomFichier, deviceType : {device : sonosPrincipal}});	
        })
    	.then(function(){
    		return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : sonosPrincipal}});
    	})
    	.then(function(infosPisteAjoutee){
	    	positionPisteAjoutee = infosPisteAjoutee.queuePosition;
    		console.log('Ajout lecture Sonos : ' + nomFichier + ' (piste Sonos N° ' + positionPisteAjoutee + ')');
			variablesPartagees.positionsPistesSonos.push(positionPisteAjoutee);
    		infosPisteAjoutee.duration = (infosPisteAjoutee.duration*1000)+800;
    	    var delai1 = ()=> new Promise((resolve, reject)=> {setTimeout(resolve, infosPisteAjoutee.duration)});
            return delai1();
    	})
    	.then(function(){
    		return enleverPistesAjoutees();
        })
    	.then(function(){
    		gladys.music.setVolume({devicetype: sonosPrincipal, volume: 10});
    	    gladys.music.setVolume({devicetype: sonosAuxiliaire, volume: 10});
    		if(variablesPartagees.pisteActuellePositionQueue !== 0){
    			gladys.modules.sonos.music.selectTrack({trackNumber : variablesPartagees.pisteActuellePositionQueue, deviceType : {device : sonosPrincipal}})
    			.then(() => gladys.modules.sonos.music.seek({seconds : variablesPartagees.pisteActuellePositionSecondes, deviceType : {device : sonosPrincipal}}))
    			.then(function(){
    				if(variablesPartagees.pisteEnLecture){
    					gladys.music.play({devicetype: sonosPrincipal})
    			    	.then(function(){
                			resolve(1);
    			    	});
                    }
					else{
						resolve(1);
					}	
    		    });				
    		}
    		else
    		    resolve(1);
    	});
    	
		var obtenirInfosPisteActuelle = (rechercheInfos)=> new Promise((resolve, reject)=>{
			if(rechercheInfos){
				gladys.music.getPlaying({devicetype: sonosPrincipal})
	    		.then(function(musiqueActive){
        			if(musiqueActive.playing){
    					gladys.music.pause({devicetype: sonosPrincipal});
        	    		variablesPartagees.pisteEnLecture = true;
            		}
    				else
        	    		variablesPartagees.pisteEnLecture = false;
    				return gladys.modules.sonos.music.getCurrentTrack({deviceType : {device : sonosPrincipal}});
    			})
    			.then(function(pisteActuelle){
    	    		if(pisteActuelle.queuePosition !== 0){
    					variablesPartagees.pisteActuellePositionQueue = pisteActuelle.queuePosition;
    					variablesPartagees.pisteActuellePositionSecondes = pisteActuelle.position;
    					console.log('Infos piste actuelle, titre : ' + pisteActuelle.title + ', position : ' + pisteActuelle.position + ' secondes' + ', lecture en cours : ' + variablesPartagees.pisteEnLecture);
    	    		}
    	    		else{
						console.log('Aucune Playlist trouvée !');
    					variablesPartagees.pisteActuellePositionQueue = 0;
    					variablesPartagees.pisteActuellePositionSecondes = 0;
    	    		}
					resolve(1);
    			});
			}
			else
				resolve(1);
    	});

    	var enleverPistesAjoutees = ()=> new Promise((resolve, reject)=>{
    		var dernierIndexTableauPistes = variablesPartagees.positionsPistesSonos.length-1;
            if(positionPisteAjoutee === variablesPartagees.positionsPistesSonos[dernierIndexTableauPistes]){
    			gladys.music.pause({devicetype: sonosPrincipal});
    			variablesPartagees.positionsPistesSonos.sort(function(a, b) { return a - b; });
    			loop();
    		}
    		else
    			reject(1);
    		function loop(){
        		if(dernierIndexTableauPistes >= 0){
					 console.log('suppression piste Sonos N° ' + variablesPartagees.positionsPistesSonos[dernierIndexTableauPistes]);
    				gladys.modules.sonos.music.removeTrackFromQueue({trackNumber : variablesPartagees.positionsPistesSonos[dernierIndexTableauPistes], deviceType : {device : sonosPrincipal}})
    				.then(function(){
    					dernierIndexTableauPistes -= 1;
                		loop();
    				});
        		}
        		else{
    				variablesPartagees.positionsPistesSonos = [];
            		resolve(1);
    			}
    		}
    	});
    });
};