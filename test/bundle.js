function buildFakeGeoJson(nrOfPoint, nrOfHours, x,valueXsMin, valueXsMax, valueSMin, valueSMax){
let FeatureCollectionTemplate =   {
       "type": "FeatureCollection",
       "features": [
			 ]
	};
	for (i = 0; i < nrOfPoint; i++){
					FeatureCollectionTemplate.features.push(returnPointFeature(53, 48, 7.9, 13.4, 0, 3, 0, 3)); // long lat rectangleInbounds of Germany
		for (j = 0; j < nrOfHours; j++){
						FeatureCollectionTemplate.features[i]['properties']['data'].push(
							 {
										'valueXs': randomBetweenAandB(valueXsMax, valueXsMin, 2),
										'valueS': randomBetweenAandB(valueSMin, valueSMax, 2), 
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
				if ( b > a ) { max = b; min = a;} else { a = max, b = min;}
				let val = (Math.random()*(max-min+1)+min).toFixed(nrOfDigits);
				if(nrOfDigits == 0){ return parseInt(val);} else { return parseFloat(val); }
}

describe("Testing the fake buildFakeGeoJson function", function() {
  it("should call the function and return something", function() {
			
		let retVal = buildFakeGeoJson(1, 2, 0, 3, 0, 3);
		expect(true).toBe(true);
  });

  it("should call the function and return FeatureCollection", function() {
			
		let retVal = buildFakeGeoJson(1,2, 0,3, 0, 3);
		expect(retVal["type"]).toBe("FeatureCollection");
  });

  it("should return two point features", function() {
		let retVal = buildFakeGeoJson(2,1,3,0,3,0);
		expect(retVal.features.length).toBe(2);
  });

  it("should return a date propert.date array", function() {
		let retVal = buildFakeGeoJson(2,1,10,3,0,3,0);
		expect(Array.isArray(retVal.features[0]['properties']['data'])).toBe(true);
  });
});

describe("Testing randomBetweenAandB", function() {
  it("should call the randomBetweenAandB and return a number", function() {
			
		let retVal = randomBetweenAandB(1,2,0);
									//console.log(retVal,retVal);
		expect(typeof retVal).toBe('number');
	});
	
	it("given 3 and 5...", function() {
			
		let retVal = randomBetweenAandB(3,5,0);
					console.log(retVal);
		expect(retVal>=3 && retVal<= 5).toBe(true);
	});
			
	it("given 4 and 9...", function() {
			
		let retVal = randomBetweenAandB(3,5,0);
		expect(typeof retVal).toBe('number');
	});
});


describe("pointFeature", function() {
  it("should return a pointFeature", function() {
			let retVal = returnPointFeature(53, 48, 7.9, 13.4);
		expect(retVal['type']).toBe("Feature");
  });
});
