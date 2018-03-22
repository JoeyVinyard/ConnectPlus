const http = require('http');
const port = 3000

var routeHandler = require('./routeHandler.js');

const requestHandler = (request, response) => {
	var parsedUrl = request.url.substring(1).split('/');
	console.log(parsedUrl);
	var routeFunction = routeHandler[parsedUrl[0]];
	if(request.headers.origin){
		response.setHeader("Access-Control-Allow-Origin", request.headers.origin, 'always');
	}
	response.setHeader('Access-Control-Allow-Headers', 'content-type');
	response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	try{
		routeFunction(request,response, parsedUrl);
	}catch(err){
		console.error(err);
	}
}

function getDistance(locOne, locTwo){
	var lat1 = locOne.lat;
	var lon1 = locOne.lon;
	var lat2 = locTwo.lat;
	var lon2 = locTwo.lon;
	var r = 6371e3;
	var φ1 = toRad(lat1);
	var φ2 = toRad(lat2);
	var Δφ = toRad((lat2-lat1));
	var Δλ = toRad((lon2-lon1));

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = (r * c)*3.28084;
	return d;
}

function toRad(Value) {
	return Value * Math.PI / 180;
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
	if(err){
		return console.log('something bad happend', err);
	}
	console.log('server is listening on', port);
	
})