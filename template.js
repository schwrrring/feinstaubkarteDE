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
}

exports.data = data;
exports.state = state;
exports.update = update;
exports.draw = draw;

}((this.template = this.template || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VzIjpbInNyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdmFyIGRhdGEgPSB7fTtcbi8vIElmIHlvdXIgdGVtcGxhdGUgaW5jbHVkZXMgZGF0YSB0YWJsZXMsIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGFjY2VzcyB0aGUgZGF0YS5cbi8vIEVhY2ggb2YgdGhlICdkYXRhc2V0cycgaW4gZGF0YS5qc29uIGZpbGUgd2lsbCBiZSBhdmFpbGFibGUgYXMgcHJvcGVydGllcyBvZiB0aGUgZGF0YS5cblxuZXhwb3J0IHZhciBzdGF0ZSA9IHtcbiAgZXhhbXBsZV9zdGF0ZV9wcm9wZXJ0eTogMjVcbiAgLy8gVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGVtcGxhdGUuIFlvdSBjYW4gbWFrZSBzb21lIG9yIGFsbCBvZiB0aGUgcHJvcGVydGllc1xuICAvLyBvZiB0aGUgc3RhdGUgb2JqZWN0IGF2YWlsYWJsZSB0byB0aGUgdXNlciBhcyBzZXR0aW5ncyBpbiBzZXR0aW5ncy5qcy5cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gIC8vIFRoZSB1cGRhdGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSB1c2VyIGNoYW5nZXMgYSBkYXRhIHRhYmxlIG9yIHNldHRpbmdzXG4gIC8vIGluIHRoZSB2aXN1YWxpc2F0aW9uIGVkaXRvciwgb3Igd2hlbiBjaGFuZ2luZyBzbGlkZXMgaW4gdGhlIHN0b3J5IGVkaXRvci5cblxuICAvLyBUaXA6IHRvIG1ha2UgeW91ciB0ZW1wbGF0ZSB3b3JrIG5pY2VseSBpbiB0aGUgc3RvcnkgZWRpdG9yLCBlbnN1cmUgdGhhdCBhbGwgdXNlclxuICAvLyBpbnRlcmZhY2UgY29udHJvbHMgc3VjaCBhcyBidXR0b25zIGFuZCBzbGlkZXJzIHVwZGF0ZSB0aGUgc3RhdGUgYW5kIHRoZW4gY2FsbCB1cGRhdGUuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KCkge1xuICAvLyBUaGUgZHJhdyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgdGVtcGxhdGUgZmlyc3QgbG9hZHNcbn1cbiJdLCJuYW1lcyI6WyJkYXRhIiwic3RhdGUiLCJ1cGRhdGUiLCJkcmF3Il0sIm1hcHBpbmdzIjoiOzs7QUFBTyxJQUFJQSxPQUFPLEVBQVg7Ozs7QUFJUCxBQUFPLElBQUlDLFFBQVE7MEJBQ087OztDQURuQjs7QUFNUCxBQUFPLFNBQVNDLE1BQVQsR0FBa0I7Ozs7Ozs7O0FBUXpCLEFBQU8sU0FBU0MsSUFBVCxHQUFnQjs7Ozs7Ozs7OyJ9
