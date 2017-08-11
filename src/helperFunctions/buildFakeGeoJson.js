
import { writeFile } from 'fs' 
let oneWeek = buildFakeGeoJson(5093, 161, 1, 3, 1, 3);
writeFile('./static/fakeDataOneWeek.json', JSON.stringify(oneWeek),()=> console.log('file written'));

let oneDay = buildFakeGeoJson(5093, 24, 1, 3, 1, 3);
let oneWeekOneMeasurePerDay = buildFakeGeoJson(5093, 1, 1, 3, 1, 3);
writeFile('./static/oneWeekOneMeasurePerDay.json', JSON.stringify(oneWeekOneMeasurePerDay),()=> console.log('file written'));


export function buildFakeGeoJson(nrOfPoint, nrOfHours,valueXsMin, valueXsMax, valueSMin, valueSMax){
let FeatureCollectionTemplate =   {
       "type": "FeatureCollection",
       "features": [
			 ]
	}
	for (let i = 0; i < nrOfPoint; i++){
					FeatureCollectionTemplate.features.push(returnPointFeature(7.5, 13, 53, 48)) // long lat rectangleInbounds of Germany
		for (let j = 0; j < nrOfHours; j++){
						FeatureCollectionTemplate.features[i]['properties']['data'].push(
							 {
										'valueXs': randomBetweenAandB(valueXsMax, valueXsMin, 0),
										'valueS': randomBetweenAandB(valueSMin, valueSMax, 0)
											 //, 
										//'time': 1
							}
						)
		}				
	}
				return FeatureCollectionTemplate;
}

export function returnPointFeature (latMin, latMax, longMin,longMax){
			let retVal =	{
           "type": "Feature",
           "geometry": {
               "type": "Point",
               "coordinates": [randomBetweenAandB(latMin,latMax,2), randomBetweenAandB(longMin, longMax, 2)]
           },
           "properties": {
						//	 "id": 123,		 
               "data": [
											
							 ]
           }
       }
			return retVal
}

function produceUniquieId (){
 return true
}

export function randomBetweenAandB (a, b, nrOfDigits){
				let min,max;
				if ( b > a ) { max = b; min = a;} else { max = a , min = b};
				let val = (Math.random()*(max-min+1)+min).toFixed(nrOfDigits);
				if(nrOfDigits == 0){ return parseInt(val);} else { return parseFloat(val); }
}			
console.log('test');
