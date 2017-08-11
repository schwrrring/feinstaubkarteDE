'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');

let oneWeek = buildFakeGeoJson(53, 161, 1, 3, 1, 3);
fs.writeFile('./static/fakeDataOneWeek.json', JSON.stringify(oneWeek,0,4),()=> console.log('file written'));


function buildFakeGeoJson(nrOfPoint, nrOfHours,valueXsMin, valueXsMax, valueSMin, valueSMax){
let FeatureCollectionTemplate =   {
       "type": "FeatureCollection",
       "features": [
			 ]
	};
	for (let i = 0; i < nrOfPoint; i++){
					FeatureCollectionTemplate.features.push(returnPointFeature(7.5, 13, 53, 48)); // long lat rectangleInbounds of Germany
		for (let j = 0; j < nrOfHours; j++){
						FeatureCollectionTemplate.features[i]['properties']['data'].push(
							 {
										'valueXs': randomBetweenAandB(valueXsMax, valueXsMin, 0),
										'valueS': randomBetweenAandB(valueSMin, valueSMax, 0), 
										'time': 1
							}
						);
		}				
	}
				return FeatureCollectionTemplate;
}

function returnPointFeature (latMin, latMax, longMin,longMax){
			let retVal =	{
           "type": "Feature",
           "geometry": {
               "type": "Point",
               "coordinates": [randomBetweenAandB(latMin,latMax,2), randomBetweenAandB(longMin, longMax, 2)]
           },
           "properties": {
							 "id": 123,		 
               "data": [
											
							 ]
           }
       };
			return retVal
}

function randomBetweenAandB (a, b, nrOfDigits){
				let min,max;
				if ( b > a ) { max = b; min = a;} else { max = a , min = b;}
				let val = (Math.random()*(max-min+1)+min).toFixed(nrOfDigits);
				if(nrOfDigits == 0){ return parseInt(val);} else { return parseFloat(val); }
}			
console.log('test');

exports.buildFakeGeoJson = buildFakeGeoJson;
exports.returnPointFeature = returnPointFeature;
exports.randomBetweenAandB = randomBetweenAandB;
