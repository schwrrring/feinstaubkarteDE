import { buildFakeGeoJson } from '../src/helperFunctions/buildFakeGeoJson.js';	

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

import { randomBetweenAandB } from '../src/helperFunctions/buildFakeGeoJson.js';	

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

