//import select, scale-time, axis bottom, area, extent, event, timepars, max ... und was vergessen
export function sensorChart() {
    if(data["sp500"]){
    data = data["sp500"];
    data = data.map(function (a) {
        return type(a)
    });
		}

var     width = window.innerWidth,
				height = window.innerHeight;

		var	margin_top = Math.round(height * (20/500)),
				margin2_top = Math.round(height * (430/500)),
				margin_bottom = Math.round(height * 110/500),
				margin2_bottom = Math.round(height * 30/500),
				margin_left = Math.round(height * (40/960)),
				margin2_left = Math.round(height * (40/960)),
				margin_right = Math.round(height * 20/960),
				margin2_right = Math.round(height * 20/960);

								

    var svg = select(document.body).append("svg").attr("width", width ).attr("height", height),
        margin = {top: margin_top, right: margin_right, bottom: margin_bottom, left: margin_left},
        margin2 = {top: margin2_top, right: margin2_right, bottom: margin2_bottom, left: margin2_left},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom;

		
    var x = scaleTime().range([0, width]),
        x2 = scaleTime().range([0, width]),
        y = scaleLinear().range([height, 0]),
        y2 = scaleLinear().range([height2, 0]);

    var xAxis = axisBottom(x),
        xAxis2 = axisBottom(x2),
        yAxis = axisLeft(y);

    var brush = brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

    var zoom = zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var area = area()
        .curve(curveMonotoneX)
        .x(function (d) {
            return x(d.date);
        })
        .y0(height)
        .y1(function (d) {
            return y(d.price);
        });

    var area2 = area()
        .curve(curveMonotoneX)
        .x(function (d) {
            return x2(d.date);
        })
        .y0(height2)
        .y1(function (d) {
            return y2(d.price);
        });

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


    x.domain(extent(data, function (d) {
        return d.date;
    }));
    y.domain([0, max(data, function (d) {
        return d.price;
    })]);

    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);


    function brushed() {
        if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    function zoomed() {
        if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }
}
function type(d) {
    d.date = parseDate(d.date);
    d.price = parseInt(d.price);
    return d;
}

var parseDate = timeParse("%b %Y");
