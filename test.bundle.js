function buildFakeGeoJson(nrOfPoint, nrOfDays){
let FeatureCollectionTemplate =   {
       "type": "FeatureColection",
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

describe("Testing the fake buildFakeGeoJson function", function() {
  it("should call the function and return something", function() {
			
		let retVal = buildFakeGeoJson(1,2);
		expect(retVal).toBe(true);
  });
});

describe("", function() {
  it("should call the function and return FeatureCollection", function() {
			
		let retVal = buildFakeGeoJson(1,2);
		expect(retVal["type"]).toBe("FeatureCollection");
  });
});
