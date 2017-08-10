export function buildFakeGeoJson(nrOfPoint, nrOfHours, x,valueXsMin, valueXsMax, valueSMin, valueSMax){
let FeatureCollectionTemplate =   {
       "type": "FeatureCollection",
       "features": [
			 ]
	}
	for (i = 0; i < nrOfPoint; i++){
					FeatureCollectionTemplate.features.push(returnPointFeature(53, 48, 7.9, 13.4, 0, 3, 0, 3)) // long lat rectangleInbounds of Germany
		for (j = 0; j < nrOfHours; j++){
						FeatureCollectionTemplate.features[i]['properties']['data'].push(
							 {
										'valueXs': randomBetweenAandB(valueXsMax, valueXsMin, 2),
										'valueS': randomBetweenAandB(valueSMin, valueSMax, 2), 
										'time': 1
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
							 "id": 123,		 
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
				if ( b > a ) { max = b; min = a;} else { a = max, b = min};
				let val = (Math.random()*(max-min+1)+min).toFixed(nrOfDigits);
				if(nrOfDigits == 0){ return parseInt(val);} else { return parseFloat(val); }
}			


