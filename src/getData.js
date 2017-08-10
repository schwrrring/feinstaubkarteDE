import {request} from 'd3-request'; 

//console.log(request, 'request log from getData')
/*
 * @params url string, callbackfunction
 * 
 */
export function getAPIData (url, callback){
 		request(url)
		.get(callback);	
		return true;		
}

export function getJSON (url, callback){
 		request(url)
		.mimeType('application/json')
    .response(function(xhr) { return JSON.parse(xhr.responseText); })
		.get(callback);
				console.log('das kommt an')
		return true;
}				

getJSON("http://api.luftdaten.info/v1/now/?format=json", function(data){ console.log(data, 'getApiCall from getData')});
