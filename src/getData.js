import {request} from 'd3-request'; 

//console.log(request, 'request log from getData')
/*
 * @params url string, callbackfunction
 * 
 */
export function getAPIData (url, callback){
 return	request(url)
		.get(callback);	
}

//getAPIData('http://api.luftdaten.info/v1/statistics/', function(data){ console.log(data, 'getApiCall from getData')});
