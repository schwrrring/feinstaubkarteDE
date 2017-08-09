(function (exports) {
'use strict';

var data = {};
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.

var state = {
  example_state_property: 25
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
};

function update() {
  // The update function is called whenever the user changes a data table or settings
  // in the visualisation editor, or when changing slides in the story editor.

  // Tip: to make your template work nicely in the story editor, ensure that all user
  // interface controls such as buttons and sliders update the state and then call update.
}

function draw() {
  // The draw function is called when the template first loads
				var mymap = L.map('mapid').setView([51.505, -0.09], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibHVuZGVsaXVzIiwiYSI6ImNpdWljbmV4eTAwM2Uyb21kczN6bndrb2kifQ.AXS9vjUNgfpx8zrAfNT2pw'
        }).addTo(mymap);
}

exports.data = data;
exports.state = state;
exports.update = update;
exports.draw = draw;

}((this.template = this.template || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VzIjpbInNyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIGRhdGEgPSB7fTtcbi8vIElmIHlvdXIgdGVtcGxhdGUgaW5jbHVkZXMgZGF0YSB0YWJsZXMsIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGFjY2VzcyB0aGUgZGF0YS5cbi8vIEVhY2ggb2YgdGhlICdkYXRhc2V0cycgaW4gZGF0YS5qc29uIGZpbGUgd2lsbCBiZSBhdmFpbGFibGUgYXMgcHJvcGVydGllcyBvZiB0aGUgZGF0YS5cblxuZXhwb3J0IHZhciBzdGF0ZSA9IHtcbiAgZXhhbXBsZV9zdGF0ZV9wcm9wZXJ0eTogMjVcbiAgLy8gVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGVtcGxhdGUuIFlvdSBjYW4gbWFrZSBzb21lIG9yIGFsbCBvZiB0aGUgcHJvcGVydGllc1xuICAvLyBvZiB0aGUgc3RhdGUgb2JqZWN0IGF2YWlsYWJsZSB0byB0aGUgdXNlciBhcyBzZXR0aW5ncyBpbiBzZXR0aW5ncy5qcy5cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gIC8vIFRoZSB1cGRhdGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSB1c2VyIGNoYW5nZXMgYSBkYXRhIHRhYmxlIG9yIHNldHRpbmdzXG4gIC8vIGluIHRoZSB2aXN1YWxpc2F0aW9uIGVkaXRvciwgb3Igd2hlbiBjaGFuZ2luZyBzbGlkZXMgaW4gdGhlIHN0b3J5IGVkaXRvci5cblxuICAvLyBUaXA6IHRvIG1ha2UgeW91ciB0ZW1wbGF0ZSB3b3JrIG5pY2VseSBpbiB0aGUgc3RvcnkgZWRpdG9yLCBlbnN1cmUgdGhhdCBhbGwgdXNlclxuICAvLyBpbnRlcmZhY2UgY29udHJvbHMgc3VjaCBhcyBidXR0b25zIGFuZCBzbGlkZXJzIHVwZGF0ZSB0aGUgc3RhdGUgYW5kIHRoZW4gY2FsbCB1cGRhdGUuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KCkge1xuICAvLyBUaGUgZHJhdyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgdGVtcGxhdGUgZmlyc3QgbG9hZHNcblx0XHRcdFx0dmFyIG15bWFwID0gTC5tYXAoJ21hcGlkJykuc2V0VmlldyhbNTEuNTA1LCAtMC4wOV0sIDEzKTtcblxuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC97aWR9L3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49e2FjY2Vzc1Rva2VufScsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+LCBJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwOi8vbWFwYm94LmNvbVwiPk1hcGJveDwvYT4nLFxuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBpZDogJ21hcGJveC5zdHJlZXRzJyxcbiAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiAncGsuZXlKMUlqb2liSFZ1WkdWc2FYVnpJaXdpWVNJNkltTnBkV2xqYm1WNGVUQXdNMlV5YjIxa2N6TjZibmRyYjJraWZRLkFYUzl2alVOZ2ZweDh6ckFmTlQycHcnXG4gICAgICAgIH0pLmFkZFRvKG15bWFwKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBTyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Ozs7QUFJckIsQUFBTyxJQUFJLEtBQUssR0FBRztFQUNqQixzQkFBc0IsRUFBRSxFQUFFOzs7Q0FHM0IsQ0FBQzs7QUFFRixBQUFPLFNBQVMsTUFBTSxHQUFHOzs7Ozs7Q0FNeEI7O0FBRUQsQUFBTyxTQUFTLElBQUksR0FBRzs7SUFFbkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzs7UUFFcEQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxpRkFBaUYsRUFBRTtZQUMzRixXQUFXLEVBQUUsNE1BQTRNO1lBQ3pOLE9BQU8sRUFBRSxFQUFFO1lBQ1gsRUFBRSxFQUFFLGdCQUFnQjtZQUNwQixXQUFXLEVBQUUsOEZBQThGO1NBQzlHLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Q0FDdkI7Ozs7Ozs7In0=
