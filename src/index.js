import {getAPIData} from './getData.js';
//console.log(getAPIData, 'log von getAPIData nach import');

export var data = {};
 
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.
var myMap;
//console.log(1, myMap)

export var state = {
	example_state_property: 25,
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
	lat: 51.505,
	long: -0.09			
};

export function update() {
  // The update function is called whenever the user changes a data table or settings
  // in the visualisation editor, or when changing slides in the story editor.
	//	console.log(myMap, m);
	//   myMap.panTo(state.lat, state.long);
  // Tip: to make your template work nicely in the story editor, ensure that all user
  // interface controls such as buttons and sliders update the state and then call update.
				//
 //	console.log(3, myMap);	
				myMap.panTo([state.lat,state.long]);
		
}

export function draw() {
	//			console.log(2,myMap)
  // The draw function is called when the template first loads
			//	console.log(L,"L");
				myMap = L.map('mapid').setView([state.lat, state.long], 13);
	//			console.log(22,myMap);
					
				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibHVuZGVsaXVzIiwiYSI6ImNpdWljbmV4eTAwM2Uyb21kczN6bndrb2kifQ.AXS9vjUNgfpx8zrAfNT2pw'
        }).addTo(myMap);		  
}
