(function (exports) {
'use strict';

var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

function Set() {}

var proto = map.prototype;

Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set;

  // Copy constructor.
  if (object instanceof Set) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$2(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set$2(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$2(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var request = function(url, callback) {
  var request,
      event = dispatch("beforesend", "progress", "load", "error"),
      mimeType,
      headers = map(),
      xhr = new XMLHttpRequest,
      user = null,
      password = null,
      response,
      responseType,
      timeout = 0;

  // If IE does not support CORS, use XDomainRequest.
  if (typeof XDomainRequest !== "undefined"
      && !("withCredentials" in xhr)
      && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;

  "onload" in xhr
      ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
      : xhr.onreadystatechange = function(o) { xhr.readyState > 3 && respond(o); };

  function respond(o) {
    var status = xhr.status, result;
    if (!status && hasResponse(xhr)
        || status >= 200 && status < 300
        || status === 304) {
      if (response) {
        try {
          result = response.call(request, xhr);
        } catch (e) {
          event.call("error", request, e);
          return;
        }
      } else {
        result = xhr;
      }
      event.call("load", request, result);
    } else {
      event.call("error", request, o);
    }
  }

  xhr.onprogress = function(e) {
    event.call("progress", request, e);
  };

  request = {
    header: function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers.get(name);
      if (value == null) headers.remove(name);
      else headers.set(name, value + "");
      return request;
    },

    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return request;
    },

    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return request;
    },

    timeout: function(value) {
      if (!arguments.length) return timeout;
      timeout = +value;
      return request;
    },

    user: function(value) {
      return arguments.length < 1 ? user : (user = value == null ? null : value + "", request);
    },

    password: function(value) {
      return arguments.length < 1 ? password : (password = value == null ? null : value + "", request);
    },

    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function(value) {
      response = value;
      return request;
    },

    // Alias for send("GET", …).
    get: function(data, callback) {
      return request.send("GET", data, callback);
    },

    // Alias for send("POST", …).
    post: function(data, callback) {
      return request.send("POST", data, callback);
    },

    // If callback is non-null, it will be used for error and load events.
    send: function(method, data, callback) {
      xhr.open(method, url, true, user, password);
      if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
      if (xhr.setRequestHeader) headers.each(function(value, name) { xhr.setRequestHeader(name, value); });
      if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
      if (responseType != null) xhr.responseType = responseType;
      if (timeout > 0) xhr.timeout = timeout;
      if (callback == null && typeof data === "function") callback = data, data = null;
      if (callback != null && callback.length === 1) callback = fixCallback(callback);
      if (callback != null) request.on("error", callback).on("load", function(xhr) { callback(null, xhr); });
      event.call("beforesend", request, xhr);
      xhr.send(data == null ? null : data);
      return request;
    },

    abort: function() {
      xhr.abort();
      return request;
    },

    on: function() {
      var value = event.on.apply(event, arguments);
      return value === event ? request : value;
    }
  };

  if (callback != null) {
    if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
    return request.get(callback);
  }

  return request;
};

function fixCallback(callback) {
  return function(error, xhr) {
    callback(error == null ? xhr : null);
  };
}

function hasResponse(xhr) {
  var type = xhr.responseType;
  return type && type !== "text"
      ? xhr.response // null on error
      : xhr.responseText; // "" on error
}

var type = function(defaultMimeType, response) {
  return function(url, callback) {
    var r = request(url).mimeType(defaultMimeType).response(response);
    if (callback != null) {
      if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
      return r.get(callback);
    }
    return r;
  };
};

type("text/html", function(xhr) {
  return document.createRange().createContextualFragment(xhr.responseText);
});

var json = type("application/json", function(xhr) {
  return JSON.parse(xhr.responseText);
});

type("text/plain", function(xhr) {
  return xhr.responseText;
});

type("application/xml", function(xhr) {
  var xml = xhr.responseXML;
  if (!xml) throw new Error("parse error");
  return xml;
});

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function(row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

var dsv = function(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      delimiterCode = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns;
    return rows;
  }

  function parseRows(text, f) {
    var EOL = {}, // sentinel value for end-of-line
        EOF = {}, // sentinel value for end-of-file
        rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // the current line number
        t, // the current token
        eol; // is the current token followed by EOL?

    function token() {
      if (I >= N) return EOF; // special case: end of file
      if (eol) return eol = false, EOL; // special case: end of line

      // special case: quotes
      var j = I, c;
      if (text.charCodeAt(j) === 34) {
        var i = j;
        while (i++ < N) {
          if (text.charCodeAt(i) === 34) {
            if (text.charCodeAt(i + 1) !== 34) break;
            ++i;
          }
        }
        I = i + 2;
        c = text.charCodeAt(i + 1);
        if (c === 13) {
          eol = true;
          if (text.charCodeAt(i + 2) === 10) ++I;
        } else if (c === 10) {
          eol = true;
        }
        return text.slice(j + 1, i).replace(/""/g, "\"");
      }

      // common case: find next delimiter or newline
      while (I < N) {
        var k = 1;
        c = text.charCodeAt(I++);
        if (c === 10) eol = true; // \n
        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
        else if (c !== delimiterCode) continue;
        return text.slice(j, I - k);
      }

      // special case: last token before EOF
      return text.slice(j);
    }

    while ((t = token()) !== EOF) {
      var a = [];
      while (t !== EOL && t !== EOF) {
        a.push(t);
        t = token();
      }
      if (f && (a = f(a, n++)) == null) continue;
      rows.push(a);
    }

    return rows;
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    })).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(text) {
    return text == null ? ""
        : reFormat.test(text += "") ? "\"" + text.replace(/\"/g, "\"\"") + "\""
        : text;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatRows: formatRows
  };
};

var csv$1 = dsv(",");

var csvParse = csv$1.parse;

var tsv = dsv("\t");

var tsvParse = tsv.parse;

var dsv$1 = function(defaultMimeType, parse) {
  return function(url, row, callback) {
    if (arguments.length < 3) callback = row, row = null;
    var r = request(url).mimeType(defaultMimeType);
    r.row = function(_) { return arguments.length ? r.response(responseOf(parse, row = _)) : row; };
    r.row(row);
    return callback ? r.get(callback) : r;
  };
};

function responseOf(parse, row) {
  return function(request$$1) {
    return parse(request$$1.responseText, row);
  };
}

dsv$1("text/csv", csvParse);

dsv$1("text/tab-separated-values", tsvParse);

//reactivate, wenn getting data from the api
//import {getAPIData} from './getData.js';
//console.log(getAPIData, 'log von getAPIData nach import');

var data = {};
 
// If your template includes data tables, use this variable to access the data.
// Each of the 'datasets' in data.json file will be available as properties of the data.
var myMap;
//console.log(1, myMap)

var state = {
	example_state_property: 25,
  // The current state of template. You can make some or all of the properties
  // of the state object available to the user as settings in settings.js.
	lat: 49.505,
	long: 8.09			
};

function update() {
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

function draw() {
	//			console.log(2,myMap)
  // The draw function is called when the template first loads
			//	console.log(L,"L");
				myMap = L.map('mapid').setView([state.lat, state.long], 6);
	//			console.log(22,myMap);
					
				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.pencil',
            accessToken: 'pk.eyJ1IjoibHVuZGVsaXVzIiwiYSI6ImNpdWljbmV4eTAwM2Uyb21kczN6bndrb2kifQ.AXS9vjUNgfpx8zrAfNT2pw'
        }).addTo(myMap);		
				
	var weekData = json( Flourish.static_prefix + '/oneWeekOneMeasurePerDay.json', function(data){
					console.log(data);
		L.geoJson(data).addTo(myMap);
	}); 	
}

exports.data = data;
exports.state = state;
exports.update = update;
exports.draw = draw;

}((this.template = this.template || {})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9kMy1jb2xsZWN0aW9uL3NyYy9tYXAuanMiLCJub2RlX21vZHVsZXMvZDMtY29sbGVjdGlvbi9zcmMvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2QzLWRpc3BhdGNoL3NyYy9kaXNwYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9kMy1yZXF1ZXN0L3NyYy9yZXF1ZXN0LmpzIiwibm9kZV9tb2R1bGVzL2QzLXJlcXVlc3Qvc3JjL3R5cGUuanMiLCJub2RlX21vZHVsZXMvZDMtcmVxdWVzdC9zcmMvaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9kMy1yZXF1ZXN0L3NyYy9qc29uLmpzIiwibm9kZV9tb2R1bGVzL2QzLXJlcXVlc3Qvc3JjL3RleHQuanMiLCJub2RlX21vZHVsZXMvZDMtcmVxdWVzdC9zcmMveG1sLmpzIiwibm9kZV9tb2R1bGVzL2QzLWRzdi9zcmMvZHN2LmpzIiwibm9kZV9tb2R1bGVzL2QzLWRzdi9zcmMvY3N2LmpzIiwibm9kZV9tb2R1bGVzL2QzLWRzdi9zcmMvdHN2LmpzIiwibm9kZV9tb2R1bGVzL2QzLXJlcXVlc3Qvc3JjL2Rzdi5qcyIsIm5vZGVfbW9kdWxlcy9kMy1yZXF1ZXN0L3NyYy9jc3YuanMiLCJub2RlX21vZHVsZXMvZDMtcmVxdWVzdC9zcmMvdHN2LmpzIiwic3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB2YXIgcHJlZml4ID0gXCIkXCI7XG5cbmZ1bmN0aW9uIE1hcCgpIHt9XG5cbk1hcC5wcm90b3R5cGUgPSBtYXAucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogTWFwLFxuICBoYXM6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiAocHJlZml4ICsga2V5KSBpbiB0aGlzO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzW3ByZWZpeCArIGtleV07XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHRoaXNbcHJlZml4ICsga2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBwcm9wZXJ0eSA9IHByZWZpeCArIGtleTtcbiAgICByZXR1cm4gcHJvcGVydHkgaW4gdGhpcyAmJiBkZWxldGUgdGhpc1twcm9wZXJ0eV07XG4gIH0sXG4gIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgZGVsZXRlIHRoaXNbcHJvcGVydHldO1xuICB9LFxuICBrZXlzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIGlmIChwcm9wZXJ0eVswXSA9PT0gcHJlZml4KSBrZXlzLnB1c2gocHJvcGVydHkuc2xpY2UoMSkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9LFxuICB2YWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgdmFsdWVzLnB1c2godGhpc1twcm9wZXJ0eV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0sXG4gIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykgaWYgKHByb3BlcnR5WzBdID09PSBwcmVmaXgpIGVudHJpZXMucHVzaCh7a2V5OiBwcm9wZXJ0eS5zbGljZSgxKSwgdmFsdWU6IHRoaXNbcHJvcGVydHldfSk7XG4gICAgcmV0dXJuIGVudHJpZXM7XG4gIH0sXG4gIHNpemU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzaXplID0gMDtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgKytzaXplO1xuICAgIHJldHVybiBzaXplO1xuICB9LFxuICBlbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykgaWYgKHByb3BlcnR5WzBdID09PSBwcmVmaXgpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZWFjaDogZnVuY3Rpb24oZikge1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIGlmIChwcm9wZXJ0eVswXSA9PT0gcHJlZml4KSBmKHRoaXNbcHJvcGVydHldLCBwcm9wZXJ0eS5zbGljZSgxKSwgdGhpcyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG1hcChvYmplY3QsIGYpIHtcbiAgdmFyIG1hcCA9IG5ldyBNYXA7XG5cbiAgLy8gQ29weSBjb25zdHJ1Y3Rvci5cbiAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIE1hcCkgb2JqZWN0LmVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkgeyBtYXAuc2V0KGtleSwgdmFsdWUpOyB9KTtcblxuICAvLyBJbmRleCBhcnJheSBieSBudW1lcmljIGluZGV4IG9yIHNwZWNpZmllZCBrZXkgZnVuY3Rpb24uXG4gIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuICAgIHZhciBpID0gLTEsXG4gICAgICAgIG4gPSBvYmplY3QubGVuZ3RoLFxuICAgICAgICBvO1xuXG4gICAgaWYgKGYgPT0gbnVsbCkgd2hpbGUgKCsraSA8IG4pIG1hcC5zZXQoaSwgb2JqZWN0W2ldKTtcbiAgICBlbHNlIHdoaWxlICgrK2kgPCBuKSBtYXAuc2V0KGYobyA9IG9iamVjdFtpXSwgaSwgb2JqZWN0KSwgbyk7XG4gIH1cblxuICAvLyBDb252ZXJ0IG9iamVjdCB0byBtYXAuXG4gIGVsc2UgaWYgKG9iamVjdCkgZm9yICh2YXIga2V5IGluIG9iamVjdCkgbWFwLnNldChrZXksIG9iamVjdFtrZXldKTtcblxuICByZXR1cm4gbWFwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXA7XG4iLCJpbXBvcnQge2RlZmF1bHQgYXMgbWFwLCBwcmVmaXh9IGZyb20gXCIuL21hcFwiO1xuXG5mdW5jdGlvbiBTZXQoKSB7fVxuXG52YXIgcHJvdG8gPSBtYXAucHJvdG90eXBlO1xuXG5TZXQucHJvdG90eXBlID0gc2V0LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFNldCxcbiAgaGFzOiBwcm90by5oYXMsXG4gIGFkZDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YWx1ZSArPSBcIlwiO1xuICAgIHRoaXNbcHJlZml4ICsgdmFsdWVdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHJlbW92ZTogcHJvdG8ucmVtb3ZlLFxuICBjbGVhcjogcHJvdG8uY2xlYXIsXG4gIHZhbHVlczogcHJvdG8ua2V5cyxcbiAgc2l6ZTogcHJvdG8uc2l6ZSxcbiAgZW1wdHk6IHByb3RvLmVtcHR5LFxuICBlYWNoOiBwcm90by5lYWNoXG59O1xuXG5mdW5jdGlvbiBzZXQob2JqZWN0LCBmKSB7XG4gIHZhciBzZXQgPSBuZXcgU2V0O1xuXG4gIC8vIENvcHkgY29uc3RydWN0b3IuXG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBTZXQpIG9iamVjdC5lYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IHNldC5hZGQodmFsdWUpOyB9KTtcblxuICAvLyBPdGhlcndpc2UsIGFzc3VtZSBpdOKAmXMgYW4gYXJyYXkuXG4gIGVsc2UgaWYgKG9iamVjdCkge1xuICAgIHZhciBpID0gLTEsIG4gPSBvYmplY3QubGVuZ3RoO1xuICAgIGlmIChmID09IG51bGwpIHdoaWxlICgrK2kgPCBuKSBzZXQuYWRkKG9iamVjdFtpXSk7XG4gICAgZWxzZSB3aGlsZSAoKytpIDwgbikgc2V0LmFkZChmKG9iamVjdFtpXSwgaSwgb2JqZWN0KSk7XG4gIH1cblxuICByZXR1cm4gc2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzZXQ7XG4iLCJ2YXIgbm9vcCA9IHt2YWx1ZTogZnVuY3Rpb24oKSB7fX07XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIF8gPSB7fSwgdDsgaSA8IG47ICsraSkge1xuICAgIGlmICghKHQgPSBhcmd1bWVudHNbaV0gKyBcIlwiKSB8fCAodCBpbiBfKSkgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCB0eXBlOiBcIiArIHQpO1xuICAgIF9bdF0gPSBbXTtcbiAgfVxuICByZXR1cm4gbmV3IERpc3BhdGNoKF8pO1xufVxuXG5mdW5jdGlvbiBEaXNwYXRjaChfKSB7XG4gIHRoaXMuXyA9IF87XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcywgdHlwZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIGlmICh0ICYmICF0eXBlcy5oYXNPd25Qcm9wZXJ0eSh0KSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHQpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5EaXNwYXRjaC5wcm90b3R5cGUgPSBkaXNwYXRjaC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBEaXNwYXRjaCxcbiAgb246IGZ1bmN0aW9uKHR5cGVuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBfID0gdGhpcy5fLFxuICAgICAgICBUID0gcGFyc2VUeXBlbmFtZXModHlwZW5hbWUgKyBcIlwiLCBfKSxcbiAgICAgICAgdCxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gVC5sZW5ndGg7XG5cbiAgICAvLyBJZiBubyBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZXR1cm4gdGhlIGNhbGxiYWNrIG9mIHRoZSBnaXZlbiB0eXBlIGFuZCBuYW1lLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgodCA9ICh0eXBlbmFtZSA9IFRbaV0pLnR5cGUpICYmICh0ID0gZ2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUpKSkgcmV0dXJuIHQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgYSB0eXBlIHdhcyBzcGVjaWZpZWQsIHNldCB0aGUgY2FsbGJhY2sgZm9yIHRoZSBnaXZlbiB0eXBlIGFuZCBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgaWYgYSBudWxsIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJlbW92ZSBjYWxsYmFja3Mgb2YgdGhlIGdpdmVuIG5hbWUuXG4gICAgaWYgKGNhbGxiYWNrICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgY2FsbGJhY2s6IFwiICsgY2FsbGJhY2spO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAodCA9ICh0eXBlbmFtZSA9IFRbaV0pLnR5cGUpIF9bdF0gPSBzZXQoX1t0XSwgdHlwZW5hbWUubmFtZSwgY2FsbGJhY2spO1xuICAgICAgZWxzZSBpZiAoY2FsbGJhY2sgPT0gbnVsbCkgZm9yICh0IGluIF8pIF9bdF0gPSBzZXQoX1t0XSwgdHlwZW5hbWUubmFtZSwgbnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNvcHk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb3B5ID0ge30sIF8gPSB0aGlzLl87XG4gICAgZm9yICh2YXIgdCBpbiBfKSBjb3B5W3RdID0gX1t0XS5zbGljZSgpO1xuICAgIHJldHVybiBuZXcgRGlzcGF0Y2goY29weSk7XG4gIH0sXG4gIGNhbGw6IGZ1bmN0aW9uKHR5cGUsIHRoYXQpIHtcbiAgICBpZiAoKG4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMikgPiAwKSBmb3IgKHZhciBhcmdzID0gbmV3IEFycmF5KG4pLCBpID0gMCwgbiwgdDsgaSA8IG47ICsraSkgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgaWYgKCF0aGlzLl8uaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICBmb3IgKHQgPSB0aGlzLl9bdHlwZV0sIGkgPSAwLCBuID0gdC5sZW5ndGg7IGkgPCBuOyArK2kpIHRbaV0udmFsdWUuYXBwbHkodGhhdCwgYXJncyk7XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbih0eXBlLCB0aGF0LCBhcmdzKSB7XG4gICAgaWYgKCF0aGlzLl8uaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICBmb3IgKHZhciB0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXQodHlwZSwgbmFtZSkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IHR5cGUubGVuZ3RoLCBjOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKChjID0gdHlwZVtpXSkubmFtZSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIGMudmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldCh0eXBlLCBuYW1lLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IHR5cGUubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKHR5cGVbaV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgdHlwZVtpXSA9IG5vb3AsIHR5cGUgPSB0eXBlLnNsaWNlKDAsIGkpLmNvbmNhdCh0eXBlLnNsaWNlKGkgKyAxKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHR5cGUucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IGNhbGxiYWNrfSk7XG4gIHJldHVybiB0eXBlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaDtcbiIsImltcG9ydCB7bWFwfSBmcm9tIFwiZDMtY29sbGVjdGlvblwiO1xuaW1wb3J0IHtkaXNwYXRjaH0gZnJvbSBcImQzLWRpc3BhdGNoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHJlcXVlc3QsXG4gICAgICBldmVudCA9IGRpc3BhdGNoKFwiYmVmb3Jlc2VuZFwiLCBcInByb2dyZXNzXCIsIFwibG9hZFwiLCBcImVycm9yXCIpLFxuICAgICAgbWltZVR5cGUsXG4gICAgICBoZWFkZXJzID0gbWFwKCksXG4gICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QsXG4gICAgICB1c2VyID0gbnVsbCxcbiAgICAgIHBhc3N3b3JkID0gbnVsbCxcbiAgICAgIHJlc3BvbnNlLFxuICAgICAgcmVzcG9uc2VUeXBlLFxuICAgICAgdGltZW91dCA9IDA7XG5cbiAgLy8gSWYgSUUgZG9lcyBub3Qgc3VwcG9ydCBDT1JTLCB1c2UgWERvbWFpblJlcXVlc3QuXG4gIGlmICh0eXBlb2YgWERvbWFpblJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICYmICEoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB4aHIpXG4gICAgICAmJiAvXihodHRwKHMpPzopP1xcL1xcLy8udGVzdCh1cmwpKSB4aHIgPSBuZXcgWERvbWFpblJlcXVlc3Q7XG5cbiAgXCJvbmxvYWRcIiBpbiB4aHJcbiAgICAgID8geGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0geGhyLm9udGltZW91dCA9IHJlc3BvbmRcbiAgICAgIDogeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKG8pIHsgeGhyLnJlYWR5U3RhdGUgPiAzICYmIHJlc3BvbmQobyk7IH07XG5cbiAgZnVuY3Rpb24gcmVzcG9uZChvKSB7XG4gICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXMsIHJlc3VsdDtcbiAgICBpZiAoIXN0YXR1cyAmJiBoYXNSZXNwb25zZSh4aHIpXG4gICAgICAgIHx8IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwXG4gICAgICAgIHx8IHN0YXR1cyA9PT0gMzA0KSB7XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXN1bHQgPSByZXNwb25zZS5jYWxsKHJlcXVlc3QsIHhocik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBldmVudC5jYWxsKFwiZXJyb3JcIiwgcmVxdWVzdCwgZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB4aHI7XG4gICAgICB9XG4gICAgICBldmVudC5jYWxsKFwibG9hZFwiLCByZXF1ZXN0LCByZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5jYWxsKFwiZXJyb3JcIiwgcmVxdWVzdCwgbyk7XG4gICAgfVxuICB9XG5cbiAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgZXZlbnQuY2FsbChcInByb2dyZXNzXCIsIHJlcXVlc3QsIGUpO1xuICB9O1xuXG4gIHJlcXVlc3QgPSB7XG4gICAgaGVhZGVyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgbmFtZSA9IChuYW1lICsgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGhlYWRlcnMuZ2V0KG5hbWUpO1xuICAgICAgaWYgKHZhbHVlID09IG51bGwpIGhlYWRlcnMucmVtb3ZlKG5hbWUpO1xuICAgICAgZWxzZSBoZWFkZXJzLnNldChuYW1lLCB2YWx1ZSArIFwiXCIpO1xuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfSxcblxuICAgIC8vIElmIG1pbWVUeXBlIGlzIG5vbi1udWxsIGFuZCBubyBBY2NlcHQgaGVhZGVyIGlzIHNldCwgYSBkZWZhdWx0IGlzIHVzZWQuXG4gICAgbWltZVR5cGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBtaW1lVHlwZTtcbiAgICAgIG1pbWVUeXBlID0gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiB2YWx1ZSArIFwiXCI7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgLy8gU3BlY2lmaWVzIHdoYXQgdHlwZSB0aGUgcmVzcG9uc2UgdmFsdWUgc2hvdWxkIHRha2U7XG4gICAgLy8gZm9yIGluc3RhbmNlLCBhcnJheWJ1ZmZlciwgYmxvYiwgZG9jdW1lbnQsIG9yIHRleHQuXG4gICAgcmVzcG9uc2VUeXBlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmVzcG9uc2VUeXBlO1xuICAgICAgcmVzcG9uc2VUeXBlID0gdmFsdWU7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgdGltZW91dDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpbWVvdXQ7XG4gICAgICB0aW1lb3V0ID0gK3ZhbHVlO1xuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfSxcblxuICAgIHVzZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDEgPyB1c2VyIDogKHVzZXIgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IHZhbHVlICsgXCJcIiwgcmVxdWVzdCk7XG4gICAgfSxcblxuICAgIHBhc3N3b3JkOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAxID8gcGFzc3dvcmQgOiAocGFzc3dvcmQgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IHZhbHVlICsgXCJcIiwgcmVxdWVzdCk7XG4gICAgfSxcblxuICAgIC8vIFNwZWNpZnkgaG93IHRvIGNvbnZlcnQgdGhlIHJlc3BvbnNlIGNvbnRlbnQgdG8gYSBzcGVjaWZpYyB0eXBlO1xuICAgIC8vIGNoYW5nZXMgdGhlIGNhbGxiYWNrIHZhbHVlIG9uIFwibG9hZFwiIGV2ZW50cy5cbiAgICByZXNwb25zZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJlc3BvbnNlID0gdmFsdWU7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgLy8gQWxpYXMgZm9yIHNlbmQoXCJHRVRcIiwg4oCmKS5cbiAgICBnZXQ6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdC5zZW5kKFwiR0VUXCIsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLy8gQWxpYXMgZm9yIHNlbmQoXCJQT1NUXCIsIOKApikuXG4gICAgcG9zdDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiByZXF1ZXN0LnNlbmQoXCJQT1NUXCIsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLy8gSWYgY2FsbGJhY2sgaXMgbm9uLW51bGwsIGl0IHdpbGwgYmUgdXNlZCBmb3IgZXJyb3IgYW5kIGxvYWQgZXZlbnRzLlxuICAgIHNlbmQ6IGZ1bmN0aW9uKG1ldGhvZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlLCB1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAobWltZVR5cGUgIT0gbnVsbCAmJiAhaGVhZGVycy5oYXMoXCJhY2NlcHRcIikpIGhlYWRlcnMuc2V0KFwiYWNjZXB0XCIsIG1pbWVUeXBlICsgXCIsKi8qXCIpO1xuICAgICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSBoZWFkZXJzLmVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpOyB9KTtcbiAgICAgIGlmIChtaW1lVHlwZSAhPSBudWxsICYmIHhoci5vdmVycmlkZU1pbWVUeXBlKSB4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lVHlwZSk7XG4gICAgICBpZiAocmVzcG9uc2VUeXBlICE9IG51bGwpIHhoci5yZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGU7XG4gICAgICBpZiAodGltZW91dCA+IDApIHhoci50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgIGlmIChjYWxsYmFjayA9PSBudWxsICYmIHR5cGVvZiBkYXRhID09PSBcImZ1bmN0aW9uXCIpIGNhbGxiYWNrID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCAmJiBjYWxsYmFjay5sZW5ndGggPT09IDEpIGNhbGxiYWNrID0gZml4Q2FsbGJhY2soY2FsbGJhY2spO1xuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHJlcXVlc3Qub24oXCJlcnJvclwiLCBjYWxsYmFjaykub24oXCJsb2FkXCIsIGZ1bmN0aW9uKHhocikgeyBjYWxsYmFjayhudWxsLCB4aHIpOyB9KTtcbiAgICAgIGV2ZW50LmNhbGwoXCJiZWZvcmVzZW5kXCIsIHJlcXVlc3QsIHhocik7XG4gICAgICB4aHIuc2VuZChkYXRhID09IG51bGwgPyBudWxsIDogZGF0YSk7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgeGhyLmFib3J0KCk7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gZXZlbnQub24uYXBwbHkoZXZlbnQsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IGV2ZW50ID8gcmVxdWVzdCA6IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBjYWxsYmFjazogXCIgKyBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiByZXF1ZXN0O1xufVxuXG5mdW5jdGlvbiBmaXhDYWxsYmFjayhjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24oZXJyb3IsIHhocikge1xuICAgIGNhbGxiYWNrKGVycm9yID09IG51bGwgPyB4aHIgOiBudWxsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaGFzUmVzcG9uc2UoeGhyKSB7XG4gIHZhciB0eXBlID0geGhyLnJlc3BvbnNlVHlwZTtcbiAgcmV0dXJuIHR5cGUgJiYgdHlwZSAhPT0gXCJ0ZXh0XCJcbiAgICAgID8geGhyLnJlc3BvbnNlIC8vIG51bGwgb24gZXJyb3JcbiAgICAgIDogeGhyLnJlc3BvbnNlVGV4dDsgLy8gXCJcIiBvbiBlcnJvclxufVxuIiwiaW1wb3J0IHJlcXVlc3QgZnJvbSBcIi4vcmVxdWVzdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkZWZhdWx0TWltZVR5cGUsIHJlc3BvbnNlKSB7XG4gIHJldHVybiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHIgPSByZXF1ZXN0KHVybCkubWltZVR5cGUoZGVmYXVsdE1pbWVUeXBlKS5yZXNwb25zZShyZXNwb25zZSk7XG4gICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBjYWxsYmFjazogXCIgKyBjYWxsYmFjayk7XG4gICAgICByZXR1cm4gci5nZXQoY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfTtcbn1cbiIsImltcG9ydCB0eXBlIGZyb20gXCIuL3R5cGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgdHlwZShcInRleHQvaHRtbFwiLCBmdW5jdGlvbih4aHIpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHhoci5yZXNwb25zZVRleHQpO1xufSk7XG4iLCJpbXBvcnQgdHlwZSBmcm9tIFwiLi90eXBlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGUoXCJhcHBsaWNhdGlvbi9qc29uXCIsIGZ1bmN0aW9uKHhocikge1xuICByZXR1cm4gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbn0pO1xuIiwiaW1wb3J0IHR5cGUgZnJvbSBcIi4vdHlwZVwiO1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlKFwidGV4dC9wbGFpblwiLCBmdW5jdGlvbih4aHIpIHtcbiAgcmV0dXJuIHhoci5yZXNwb25zZVRleHQ7XG59KTtcbiIsImltcG9ydCB0eXBlIGZyb20gXCIuL3R5cGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgdHlwZShcImFwcGxpY2F0aW9uL3htbFwiLCBmdW5jdGlvbih4aHIpIHtcbiAgdmFyIHhtbCA9IHhoci5yZXNwb25zZVhNTDtcbiAgaWYgKCF4bWwpIHRocm93IG5ldyBFcnJvcihcInBhcnNlIGVycm9yXCIpO1xuICByZXR1cm4geG1sO1xufSk7XG4iLCJmdW5jdGlvbiBvYmplY3RDb252ZXJ0ZXIoY29sdW1ucykge1xuICByZXR1cm4gbmV3IEZ1bmN0aW9uKFwiZFwiLCBcInJldHVybiB7XCIgKyBjb2x1bW5zLm1hcChmdW5jdGlvbihuYW1lLCBpKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5hbWUpICsgXCI6IGRbXCIgKyBpICsgXCJdXCI7XG4gIH0pLmpvaW4oXCIsXCIpICsgXCJ9XCIpO1xufVxuXG5mdW5jdGlvbiBjdXN0b21Db252ZXJ0ZXIoY29sdW1ucywgZikge1xuICB2YXIgb2JqZWN0ID0gb2JqZWN0Q29udmVydGVyKGNvbHVtbnMpO1xuICByZXR1cm4gZnVuY3Rpb24ocm93LCBpKSB7XG4gICAgcmV0dXJuIGYob2JqZWN0KHJvdyksIGksIGNvbHVtbnMpO1xuICB9O1xufVxuXG4vLyBDb21wdXRlIHVuaXF1ZSBjb2x1bW5zIGluIG9yZGVyIG9mIGRpc2NvdmVyeS5cbmZ1bmN0aW9uIGluZmVyQ29sdW1ucyhyb3dzKSB7XG4gIHZhciBjb2x1bW5TZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgY29sdW1ucyA9IFtdO1xuXG4gIHJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICBmb3IgKHZhciBjb2x1bW4gaW4gcm93KSB7XG4gICAgICBpZiAoIShjb2x1bW4gaW4gY29sdW1uU2V0KSkge1xuICAgICAgICBjb2x1bW5zLnB1c2goY29sdW1uU2V0W2NvbHVtbl0gPSBjb2x1bW4pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbHVtbnM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGRlbGltaXRlcikge1xuICB2YXIgcmVGb3JtYXQgPSBuZXcgUmVnRXhwKFwiW1xcXCJcIiArIGRlbGltaXRlciArIFwiXFxuXFxyXVwiKSxcbiAgICAgIGRlbGltaXRlckNvZGUgPSBkZWxpbWl0ZXIuY2hhckNvZGVBdCgwKTtcblxuICBmdW5jdGlvbiBwYXJzZSh0ZXh0LCBmKSB7XG4gICAgdmFyIGNvbnZlcnQsIGNvbHVtbnMsIHJvd3MgPSBwYXJzZVJvd3ModGV4dCwgZnVuY3Rpb24ocm93LCBpKSB7XG4gICAgICBpZiAoY29udmVydCkgcmV0dXJuIGNvbnZlcnQocm93LCBpIC0gMSk7XG4gICAgICBjb2x1bW5zID0gcm93LCBjb252ZXJ0ID0gZiA/IGN1c3RvbUNvbnZlcnRlcihyb3csIGYpIDogb2JqZWN0Q29udmVydGVyKHJvdyk7XG4gICAgfSk7XG4gICAgcm93cy5jb2x1bW5zID0gY29sdW1ucztcbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUm93cyh0ZXh0LCBmKSB7XG4gICAgdmFyIEVPTCA9IHt9LCAvLyBzZW50aW5lbCB2YWx1ZSBmb3IgZW5kLW9mLWxpbmVcbiAgICAgICAgRU9GID0ge30sIC8vIHNlbnRpbmVsIHZhbHVlIGZvciBlbmQtb2YtZmlsZVxuICAgICAgICByb3dzID0gW10sIC8vIG91dHB1dCByb3dzXG4gICAgICAgIE4gPSB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgSSA9IDAsIC8vIGN1cnJlbnQgY2hhcmFjdGVyIGluZGV4XG4gICAgICAgIG4gPSAwLCAvLyB0aGUgY3VycmVudCBsaW5lIG51bWJlclxuICAgICAgICB0LCAvLyB0aGUgY3VycmVudCB0b2tlblxuICAgICAgICBlb2w7IC8vIGlzIHRoZSBjdXJyZW50IHRva2VuIGZvbGxvd2VkIGJ5IEVPTD9cblxuICAgIGZ1bmN0aW9uIHRva2VuKCkge1xuICAgICAgaWYgKEkgPj0gTikgcmV0dXJuIEVPRjsgLy8gc3BlY2lhbCBjYXNlOiBlbmQgb2YgZmlsZVxuICAgICAgaWYgKGVvbCkgcmV0dXJuIGVvbCA9IGZhbHNlLCBFT0w7IC8vIHNwZWNpYWwgY2FzZTogZW5kIG9mIGxpbmVcblxuICAgICAgLy8gc3BlY2lhbCBjYXNlOiBxdW90ZXNcbiAgICAgIHZhciBqID0gSSwgYztcbiAgICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQoaikgPT09IDM0KSB7XG4gICAgICAgIHZhciBpID0gajtcbiAgICAgICAgd2hpbGUgKGkrKyA8IE4pIHtcbiAgICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGkpID09PSAzNCkge1xuICAgICAgICAgICAgaWYgKHRleHQuY2hhckNvZGVBdChpICsgMSkgIT09IDM0KSBicmVhaztcbiAgICAgICAgICAgICsraTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgSSA9IGkgKyAyO1xuICAgICAgICBjID0gdGV4dC5jaGFyQ29kZUF0KGkgKyAxKTtcbiAgICAgICAgaWYgKGMgPT09IDEzKSB7XG4gICAgICAgICAgZW9sID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGkgKyAyKSA9PT0gMTApICsrSTtcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAxMCkge1xuICAgICAgICAgIGVvbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2UoaiArIDEsIGkpLnJlcGxhY2UoL1wiXCIvZywgXCJcXFwiXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBjb21tb24gY2FzZTogZmluZCBuZXh0IGRlbGltaXRlciBvciBuZXdsaW5lXG4gICAgICB3aGlsZSAoSSA8IE4pIHtcbiAgICAgICAgdmFyIGsgPSAxO1xuICAgICAgICBjID0gdGV4dC5jaGFyQ29kZUF0KEkrKyk7XG4gICAgICAgIGlmIChjID09PSAxMCkgZW9sID0gdHJ1ZTsgLy8gXFxuXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IDEzKSB7IGVvbCA9IHRydWU7IGlmICh0ZXh0LmNoYXJDb2RlQXQoSSkgPT09IDEwKSArK0ksICsrazsgfSAvLyBcXHJ8XFxyXFxuXG4gICAgICAgIGVsc2UgaWYgKGMgIT09IGRlbGltaXRlckNvZGUpIGNvbnRpbnVlO1xuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShqLCBJIC0gayk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogbGFzdCB0b2tlbiBiZWZvcmUgRU9GXG4gICAgICByZXR1cm4gdGV4dC5zbGljZShqKTtcbiAgICB9XG5cbiAgICB3aGlsZSAoKHQgPSB0b2tlbigpKSAhPT0gRU9GKSB7XG4gICAgICB2YXIgYSA9IFtdO1xuICAgICAgd2hpbGUgKHQgIT09IEVPTCAmJiB0ICE9PSBFT0YpIHtcbiAgICAgICAgYS5wdXNoKHQpO1xuICAgICAgICB0ID0gdG9rZW4oKTtcbiAgICAgIH1cbiAgICAgIGlmIChmICYmIChhID0gZihhLCBuKyspKSA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgIHJvd3MucHVzaChhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdChyb3dzLCBjb2x1bW5zKSB7XG4gICAgaWYgKGNvbHVtbnMgPT0gbnVsbCkgY29sdW1ucyA9IGluZmVyQ29sdW1ucyhyb3dzKTtcbiAgICByZXR1cm4gW2NvbHVtbnMubWFwKGZvcm1hdFZhbHVlKS5qb2luKGRlbGltaXRlcildLmNvbmNhdChyb3dzLm1hcChmdW5jdGlvbihyb3cpIHtcbiAgICAgIHJldHVybiBjb2x1bW5zLm1hcChmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFZhbHVlKHJvd1tjb2x1bW5dKTtcbiAgICAgIH0pLmpvaW4oZGVsaW1pdGVyKTtcbiAgICB9KSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFJvd3Mocm93cykge1xuICAgIHJldHVybiByb3dzLm1hcChmb3JtYXRSb3cpLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRSb3cocm93KSB7XG4gICAgcmV0dXJuIHJvdy5tYXAoZm9ybWF0VmFsdWUpLmpvaW4oZGVsaW1pdGVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dCA9PSBudWxsID8gXCJcIlxuICAgICAgICA6IHJlRm9ybWF0LnRlc3QodGV4dCArPSBcIlwiKSA/IFwiXFxcIlwiICsgdGV4dC5yZXBsYWNlKC9cXFwiL2csIFwiXFxcIlxcXCJcIikgKyBcIlxcXCJcIlxuICAgICAgICA6IHRleHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhcnNlOiBwYXJzZSxcbiAgICBwYXJzZVJvd3M6IHBhcnNlUm93cyxcbiAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICBmb3JtYXRSb3dzOiBmb3JtYXRSb3dzXG4gIH07XG59XG4iLCJpbXBvcnQgZHN2IGZyb20gXCIuL2RzdlwiO1xuXG52YXIgY3N2ID0gZHN2KFwiLFwiKTtcblxuZXhwb3J0IHZhciBjc3ZQYXJzZSA9IGNzdi5wYXJzZTtcbmV4cG9ydCB2YXIgY3N2UGFyc2VSb3dzID0gY3N2LnBhcnNlUm93cztcbmV4cG9ydCB2YXIgY3N2Rm9ybWF0ID0gY3N2LmZvcm1hdDtcbmV4cG9ydCB2YXIgY3N2Rm9ybWF0Um93cyA9IGNzdi5mb3JtYXRSb3dzO1xuIiwiaW1wb3J0IGRzdiBmcm9tIFwiLi9kc3ZcIjtcblxudmFyIHRzdiA9IGRzdihcIlxcdFwiKTtcblxuZXhwb3J0IHZhciB0c3ZQYXJzZSA9IHRzdi5wYXJzZTtcbmV4cG9ydCB2YXIgdHN2UGFyc2VSb3dzID0gdHN2LnBhcnNlUm93cztcbmV4cG9ydCB2YXIgdHN2Rm9ybWF0ID0gdHN2LmZvcm1hdDtcbmV4cG9ydCB2YXIgdHN2Rm9ybWF0Um93cyA9IHRzdi5mb3JtYXRSb3dzO1xuIiwiaW1wb3J0IHJlcXVlc3QgZnJvbSBcIi4vcmVxdWVzdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkZWZhdWx0TWltZVR5cGUsIHBhcnNlKSB7XG4gIHJldHVybiBmdW5jdGlvbih1cmwsIHJvdywgY2FsbGJhY2spIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIGNhbGxiYWNrID0gcm93LCByb3cgPSBudWxsO1xuICAgIHZhciByID0gcmVxdWVzdCh1cmwpLm1pbWVUeXBlKGRlZmF1bHRNaW1lVHlwZSk7XG4gICAgci5yb3cgPSBmdW5jdGlvbihfKSB7IHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gci5yZXNwb25zZShyZXNwb25zZU9mKHBhcnNlLCByb3cgPSBfKSkgOiByb3c7IH07XG4gICAgci5yb3cocm93KTtcbiAgICByZXR1cm4gY2FsbGJhY2sgPyByLmdldChjYWxsYmFjaykgOiByO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZXNwb25zZU9mKHBhcnNlLCByb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICByZXR1cm4gcGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQsIHJvdyk7XG4gIH07XG59XG4iLCJpbXBvcnQge2NzdlBhcnNlfSBmcm9tIFwiZDMtZHN2XCI7XG5pbXBvcnQgZHN2IGZyb20gXCIuL2RzdlwiO1xuXG5leHBvcnQgZGVmYXVsdCBkc3YoXCJ0ZXh0L2NzdlwiLCBjc3ZQYXJzZSk7XG4iLCJpbXBvcnQge3RzdlBhcnNlfSBmcm9tIFwiZDMtZHN2XCI7XG5pbXBvcnQgZHN2IGZyb20gXCIuL2RzdlwiO1xuXG5leHBvcnQgZGVmYXVsdCBkc3YoXCJ0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzXCIsIHRzdlBhcnNlKTtcbiIsIi8vcmVhY3RpdmF0ZSwgd2VubiBnZXR0aW5nIGRhdGEgZnJvbSB0aGUgYXBpXG4vL2ltcG9ydCB7Z2V0QVBJRGF0YX0gZnJvbSAnLi9nZXREYXRhLmpzJztcbmltcG9ydCB7IGpzb24gfSBmcm9tICdkMy1yZXF1ZXN0Jy8vIGlzIHVzZWQgdG8gZ2V0IGRhdGEgaW5zdGVhZCBvZiB1c2luZyBhcGlcbi8vY29uc29sZS5sb2coZ2V0QVBJRGF0YSwgJ2xvZyB2b24gZ2V0QVBJRGF0YSBuYWNoIGltcG9ydCcpO1xuXG5leHBvcnQgdmFyIGRhdGEgPSB7fTtcbiBcbi8vIElmIHlvdXIgdGVtcGxhdGUgaW5jbHVkZXMgZGF0YSB0YWJsZXMsIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGFjY2VzcyB0aGUgZGF0YS5cbi8vIEVhY2ggb2YgdGhlICdkYXRhc2V0cycgaW4gZGF0YS5qc29uIGZpbGUgd2lsbCBiZSBhdmFpbGFibGUgYXMgcHJvcGVydGllcyBvZiB0aGUgZGF0YS5cbnZhciBteU1hcDtcbi8vY29uc29sZS5sb2coMSwgbXlNYXApXG5cbmV4cG9ydCB2YXIgc3RhdGUgPSB7XG5cdGV4YW1wbGVfc3RhdGVfcHJvcGVydHk6IDI1LFxuICAvLyBUaGUgY3VycmVudCBzdGF0ZSBvZiB0ZW1wbGF0ZS4gWW91IGNhbiBtYWtlIHNvbWUgb3IgYWxsIG9mIHRoZSBwcm9wZXJ0aWVzXG4gIC8vIG9mIHRoZSBzdGF0ZSBvYmplY3QgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGFzIHNldHRpbmdzIGluIHNldHRpbmdzLmpzLlxuXHRsYXQ6IDQ5LjUwNSxcblx0bG9uZzogOC4wOVx0XHRcdFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgLy8gVGhlIHVwZGF0ZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHVzZXIgY2hhbmdlcyBhIGRhdGEgdGFibGUgb3Igc2V0dGluZ3NcbiAgLy8gaW4gdGhlIHZpc3VhbGlzYXRpb24gZWRpdG9yLCBvciB3aGVuIGNoYW5naW5nIHNsaWRlcyBpbiB0aGUgc3RvcnkgZWRpdG9yLlxuXHQvL1x0Y29uc29sZS5sb2cobXlNYXAsIG0pO1xuXHQvLyAgIG15TWFwLnBhblRvKHN0YXRlLmxhdCwgc3RhdGUubG9uZyk7XG4gIC8vIFRpcDogdG8gbWFrZSB5b3VyIHRlbXBsYXRlIHdvcmsgbmljZWx5IGluIHRoZSBzdG9yeSBlZGl0b3IsIGVuc3VyZSB0aGF0IGFsbCB1c2VyXG4gIC8vIGludGVyZmFjZSBjb250cm9scyBzdWNoIGFzIGJ1dHRvbnMgYW5kIHNsaWRlcnMgdXBkYXRlIHRoZSBzdGF0ZSBhbmQgdGhlbiBjYWxsIHVwZGF0ZS5cblx0XHRcdFx0Ly9cbiAvL1x0Y29uc29sZS5sb2coMywgbXlNYXApO1x0XG5cdFx0XHRcdG15TWFwLnBhblRvKFtzdGF0ZS5sYXQsc3RhdGUubG9uZ10pO1xuXHRcdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcblx0Ly9cdFx0XHRjb25zb2xlLmxvZygyLG15TWFwKVxuICAvLyBUaGUgZHJhdyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgdGVtcGxhdGUgZmlyc3QgbG9hZHNcblx0XHRcdC8vXHRjb25zb2xlLmxvZyhMLFwiTFwiKTtcblx0XHRcdFx0bXlNYXAgPSBMLm1hcCgnbWFwaWQnKS5zZXRWaWV3KFtzdGF0ZS5sYXQsIHN0YXRlLmxvbmddLCA2KTtcblx0Ly9cdFx0XHRjb25zb2xlLmxvZygyMixteU1hcCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdEwudGlsZUxheWVyKCdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L3tpZH0ve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj17YWNjZXNzVG9rZW59Jywge1xuICAgICAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sIEltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHA6Ly9tYXBib3guY29tXCI+TWFwYm94PC9hPicsXG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGlkOiAnbWFwYm94LnBlbmNpbCcsXG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogJ3BrLmV5SjFJam9pYkhWdVpHVnNhWFZ6SWl3aVlTSTZJbU5wZFdsamJtVjRlVEF3TTJVeWIyMWtjek42Ym5kcmIya2lmUS5BWFM5dmpVTmdmcHg4enJBZk5UMnB3J1xuICAgICAgICB9KS5hZGRUbyhteU1hcCk7XHRcdFxuXHRcdFx0XHRcblx0dmFyIHdlZWtEYXRhID0ganNvbiggRmxvdXJpc2guc3RhdGljX3ByZWZpeCArICcvb25lV2Vla09uZU1lYXN1cmVQZXJEYXkuanNvbicsIGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdEwuZ2VvSnNvbihkYXRhKS5hZGRUbyhteU1hcCk7XG5cdH0pIFx0XG59XG4iXSwibmFtZXMiOlsic2V0IiwiY3N2IiwicmVxdWVzdCIsImRzdiJdLCJtYXBwaW5ncyI6Ijs7O0FBQU8sSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDOztBQUV4QixTQUFTLEdBQUcsR0FBRyxFQUFFOztBQUVqQixHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUc7RUFDOUIsV0FBVyxFQUFFLEdBQUc7RUFDaEIsR0FBRyxFQUFFLFNBQVMsR0FBRyxFQUFFO0lBQ2pCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxLQUFLLElBQUksQ0FBQztHQUMvQjtFQUNELEdBQUcsRUFBRSxTQUFTLEdBQUcsRUFBRTtJQUNqQixPQUFPLElBQUks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
