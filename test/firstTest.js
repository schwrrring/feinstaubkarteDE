import { buildFakeGeoJson } from '../src/helperFunctions/buildFakeGeoJson.js';	
import { returnPointFeature } from  '../src/helperFunctions/buildFakeGeoJson.js';	
import { loadScript } from '../src/helperFunctions/loadScript.js';
import { select } from '../node_modules/d3-selection/index.js';

describe("Testing the buildFakeGeoJson function", function() {
  it("should call the function and return something", function() {
		let retVal = buildFakeGeoJson(1, 2, 0, 3, 0, 3);
		expect(true).toBe(true);
  });
  it("should call the function and return FeatureCollection", function() {
		let retVal = buildFakeGeoJson(1,2, 0,3, 0, 3);
		expect(retVal["type"]).toBe("FeatureCollection");
  })
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
					//console.log(retVal);
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
it("it should return lat as nubers", function() {
			let retVal = returnPointFeature(53, 48, 7.9, 13.4);
		expect(typeof(retVal['geometry']['coordinates'][0])).toBe('number');
  });
it("it should return long as nubers", function() {
			let retVal = returnPointFeature(53, 48, 7.9, 13.4);
		expect(typeof(retVal['geometry']['coordinates'][1])).toBe('number');
  });
});

describe("Adding a mapID div to the testDom it should be selectable in the test", function() {
	var map			
  beforeEach(function(){
			let	mapContainer = select('body').append('div').attr('id','mapid');
			map = L.map('mapid'); 
	});	
	it("calls selects #mapid", function() {	
		let retVal = select('#mapid');
		expect(Array.isArray(retVal._groups)).toBe(true);
  });
	it("it Sets the mapView and adds mapbox tilelayer", function() {
		map.setView([53, 9], 6);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.pencil',
            accessToken: 'pk.eyJ1IjoibHVuZGVsaXVzIiwiYSI6ImNpdWljbmV4eTAwM2Uyb21kczN6bndrb2kifQ.AXS9vjUNgfpx8zrAfNT2pw'
        }).addTo(map); 
		let retVal = select('.leaflet-tile-container')
			.attr('class');
		expect(retVal).toContain('leaflet-zoom-animated');
  });

	it("calls selects #mapid", function() {	
		let retVal = select('#mapid');
		expect(Array.isArray(retVal._groups)).toBe(true);
  });			
 afterEach(function(){
				 select('#mapid').remove();
  });				
});


