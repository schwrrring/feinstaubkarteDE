export function buildFakeGeoJson(nrOfPoint, nrOfDays){
let FeatureCollectionTemplate =   {
       "type": "FeatureCollection",
       "features": [{
           "type": "Feature",
           "geometry": {
               "type": "Point",
               "coordinates": [102.0, 0.5]
           },
           "properties": {
							 "id": 123,		 
               "data": [
											 {
															 'valueXs': 1,
															 'valueS': 2, 
															 'time': 3
											 }
							 ]
           }
       }]
	}
				return FeatureCollectionTemplate
}

function returnPointFeature (){
			let retVal =	{
           "type": "Feature",
           "geometry": {
               "type": "Point",
               "coordinates": [102.0, 0.5]
           },
           "properties": {
							 "id": 123,		 
               "data": [
											 {
															 'valueXs': 1,
															 'valueS': 2, 
															 'time': 3
											 }
							 ]
           }
       }
			return retVal
}


export function randomBetweenAandB (a, b, nrOfDigits){
				let min,max;
				if ( b > a ) { max = b; min = a;} else { a = max, b = min};
				let val = (Math.random()*(max-min+1)+min).toFixed(nrOfDigits);
				if(nrOfDigits == 0){ return parseInt(val);} else { return parseFloat(val); }
}				
