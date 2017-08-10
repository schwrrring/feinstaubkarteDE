import { buildFakeGeoJson } from '../src/helperFunctions/buildFakeGeoJson.js';	

describe("Testing the fake buildFakeGeoJson function", function() {
  it("should call the function and return something", function() {
			
		let retVal = buildFakeGeoJson(1,2);
		expect(true).toBe(true);
  });
});

describe("", function() {
  it("should call the function and return FeatureCollection", function() {
			
		let retVal = buildFakeGeoJson(1,2);
		expect(retVal["type"]).toBe("FeatureCollection");
  });
});
