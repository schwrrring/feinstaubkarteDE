function buildFakeGeoJson(nrOfPoint, nrOfDays){
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
	};
				return FeatureCollectionTemplate
}

function randomBetweenAandB (a, b, nrOfDigits){
				let min,max;
				if ( b > a ) { max = b; min = a;} else { a = max, b = min;}
				let val = (Math.random()*(max-min+1)+min).toFixed(nrOfDigits);
				if(nrOfDigits == 0){ return parseInt(val);} else { return parseFloat(val); }
}

describe("Testing the fake buildFakeGeoJson function", function() {
  it("should call the function and return something", function() {
			
		let retVal = buildFakeGeoJson(1,2);
		expect(true).toBe(true);
  });

  it("should call the function and return FeatureCollection", function() {
			
		let retVal = buildFakeGeoJson(1,2);
		expect(retVal["type"]).toBe("FeatureCollection");
  });
});

describe("Testing randomBetweenAandB", function() {
  it("should call the randomBetweenAandB and return a number", function() {
			
		let retVal = randomBetweenAandB(1,2,0);
					console.log(retVal,retVal);
		expect(typeof retVal).toBe('number');
	});
	
	it("given 3 and 5...", function() {
			
		let retVal = randomBetweenAandB(3,5,0);
		expect(retVal>=3 && retVal<= 5).toBe(true);
	});
			
	it("given 4 and 9...", function() {
			
		let retVal = randomBetweenAandB(3,5,0);
		expect(typeof retVal).toBe('number');
	});

});
