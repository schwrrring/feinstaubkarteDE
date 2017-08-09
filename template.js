(function (exports) {
'use strict';

var data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.
var myMap;
console.log(1, myMap);

var state = {
	example_state_property: 25,
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
	lat: 51.505,
	long: -0.09			
};

function update() {
  // The update function is called whenever the user changes a data table or settings
  // in the visualisation editor, or when changing slides in the story editor.
	//	console.log(myMap, m);
	//   myMap.panTo(state.lat, state.long);
  // Tip: to make your template work nicely in the story editor, ensure that all user
  // interface controls such as buttons and sliders update the state and then call update.
				//
 	console.log(3, myMap);	
				myMap.panTo([state.lat,state.long]);
		
}

function draw() {
				console.log(2,myMap);
  // The draw function is called when the template first loads
			//	console.log(L,"L");
				myMap = L.map('mapid').setView([state.lat, state.long], 13);
				console.log(22,myMap);
					
				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibHVuZGVsaXVzIiwiYSI6ImNpdWljbmV4eTAwM2Uyb21kczN6bndrb2kifQ.AXS9vjUNgfpx8zrAfNT2pw'
        }).addTo(myMap);
				  
}

//M+G I.(1)-M+G GBL BA.EO A  --  alt
//CARMIGN.PAT…OI. AEO ACC  -- alt
//A0DPW0
//Fonds
//M+G I.(1)-M+G GBL BA.EO A -- vorsichtig
//
//

exports.data = data;
exports.state = state;
exports.update = update;
exports.draw = draw;

}((this.template = this.template || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VzIjpbInNyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIGRhdGEgPSB7fTtcbi8vIElmIHlvdXIgdGVtcGxhdGUgaW5jbHVkZXMgZGF0YSB0YWJsZXMsIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGFjY2VzcyB0aGUgZGF0YS5cbi8vIEVhY2ggb2YgdGhlICdkYXRhc2V0cycgaW4gZGF0YS5qc29uIGZpbGUgd2lsbCBiZSBhdmFpbGFibGUgYXMgcHJvcGVydGllcyBvZiB0aGUgZGF0YS5cbnZhciBteU1hcDtcbmNvbnNvbGUubG9nKDEsIG15TWFwKVxuXG5leHBvcnQgdmFyIHN0YXRlID0ge1xuXHRleGFtcGxlX3N0YXRlX3Byb3BlcnR5OiAyNSxcbiAgLy8gVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGVtcGxhdGUuIFlvdSBjYW4gbWFrZSBzb21lIG9yIGFsbCBvZiB0aGUgcHJvcGVydGllc1xuICAvLyBvZiB0aGUgc3RhdGUgb2JqZWN0IGF2YWlsYWJsZSB0byB0aGUgdXNlciBhcyBzZXR0aW5ncyBpbiBzZXR0aW5ncy5qcy5cblx0bGF0OiA1MS41MDUsXG5cdGxvbmc6IC0wLjA5XHRcdFx0XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAvLyBUaGUgdXBkYXRlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgdXNlciBjaGFuZ2VzIGEgZGF0YSB0YWJsZSBvciBzZXR0aW5nc1xuICAvLyBpbiB0aGUgdmlzdWFsaXNhdGlvbiBlZGl0b3IsIG9yIHdoZW4gY2hhbmdpbmcgc2xpZGVzIGluIHRoZSBzdG9yeSBlZGl0b3IuXG5cdC8vXHRjb25zb2xlLmxvZyhteU1hcCwgbSk7XG5cdC8vICAgbXlNYXAucGFuVG8oc3RhdGUubGF0LCBzdGF0ZS5sb25nKTtcbiAgLy8gVGlwOiB0byBtYWtlIHlvdXIgdGVtcGxhdGUgd29yayBuaWNlbHkgaW4gdGhlIHN0b3J5IGVkaXRvciwgZW5zdXJlIHRoYXQgYWxsIHVzZXJcbiAgLy8gaW50ZXJmYWNlIGNvbnRyb2xzIHN1Y2ggYXMgYnV0dG9ucyBhbmQgc2xpZGVycyB1cGRhdGUgdGhlIHN0YXRlIGFuZCB0aGVuIGNhbGwgdXBkYXRlLlxuXHRcdFx0XHQvL1xuIFx0Y29uc29sZS5sb2coMywgbXlNYXApO1x0XG5cdFx0XHRcdG15TWFwLnBhblRvKFtzdGF0ZS5sYXQsc3RhdGUubG9uZ10pO1xuXHRcdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coMixteU1hcClcbiAgLy8gVGhlIGRyYXcgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIHRlbXBsYXRlIGZpcnN0IGxvYWRzXG5cdFx0XHQvL1x0Y29uc29sZS5sb2coTCxcIkxcIik7XG5cdFx0XHRcdG15TWFwID0gTC5tYXAoJ21hcGlkJykuc2V0Vmlldyhbc3RhdGUubGF0LCBzdGF0ZS5sb25nXSwgMTMpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygyMixteU1hcCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdEwudGlsZUxheWVyKCdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L3tpZH0ve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj17YWNjZXNzVG9rZW59Jywge1xuICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sIEltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHA6Ly9tYXBib3guY29tXCI+TWFwYm94PC9hPicsXG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGlkOiAnbWFwYm94LnN0cmVldHMnLFxuICAgICAgICAgICAgYWNjZXNzVG9rZW46ICdway5leUoxSWpvaWJIVnVaR1ZzYVhWeklpd2lZU0k2SW1OcGRXbGpibVY0ZVRBd00yVXliMjFrY3pONmJuZHJiMmtpZlEuQVhTOXZqVU5nZnB4OHpyQWZOVDJwdydcbiAgICAgICAgfSkuYWRkVG8obXlNYXApO1xuXHRcdFx0XHQgIFxufVxuXG4vL00rRyBJLigxKS1NK0cgR0JMIEJBLkVPIEEgIC0tICBhbHRcbi8vQ0FSTUlHTi5QQVTigKZPSS4gQUVPIEFDQyAgLS0gYWx0XG4vL0EwRFBXMFxuLy9Gb25kc1xuLy9NK0cgSS4oMSktTStHIEdCTCBCQS5FTyBBIC0tIHZvcnNpY2h0aWdcbi8vXG4vL1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs7O0FBR3JCLElBQUksS0FBSyxDQUFDO0FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRXJCLEFBQU8sSUFBSSxLQUFLLEdBQUc7Q0FDbEIsc0JBQXNCLEVBQUUsRUFBRTs7O0NBRzFCLEdBQUcsRUFBRSxNQUFNO0NBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtDQUNYLENBQUM7O0FBRUYsQUFBTyxTQUFTLE1BQU0sR0FBRzs7Ozs7Ozs7RUFRdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0NBRXZDOztBQUVELEFBQU8sU0FBUyxJQUFJLEdBQUc7SUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7OztJQUdwQixLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFdEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpRkFBaUYsRUFBRTtZQUN2RixXQUFXLEVBQUUsNE1BQTRNO1lBQ3pOLE9BQU8sRUFBRSxFQUFFO1lBQ1gsRUFBRSxFQUFFLGdCQUFnQjtZQUNwQixXQUFXLEVBQUUsOEZBQThGO1NBQzlHLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O0NBRXZCOzs7Ozs7OztFQVFDOzs7Ozs7OyJ9
