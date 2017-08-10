import { buildFakeGeoJson } from '../src/helperFunctions/buildFakeGeoJson.js';	
import { returnPointFeature } from  '../src/helperFunctions/buildFakeGeoJson.js';	

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

import { randomBetweenAandB } from '../src/helperFunctions/buildFakeGeoJson.js';	

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
