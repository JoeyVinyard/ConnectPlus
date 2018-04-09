const http = require('http');
var routeHandler = require('./routeHandler.js');

var server = module.exports = http.createServer((request, response) => {
	var parsedUrl = request.url.substring(1).split('/');
	console.log(parsedUrl[0])
	var routeFunction = routeHandler[parsedUrl[0]];
	if(request.headers.origin){
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200", 'always');
	}
	response.setHeader('Access-Control-Allow-Headers', 'content-type');
	response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	try{
		if(request.method == 'OPTIONS'){
			response.end("{}");
		}else{
			routeFunction(request,response, parsedUrl);
		}
	}catch(err){
		console.error(err);
	}
})



