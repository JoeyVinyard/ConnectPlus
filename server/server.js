const http = require('http');
var routeHandler = require('./routeHandler.js');

module.exports = {
	requestHandler(request, response) {
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
	},
	listen(port){
		http.createServer(this.requestHandler).listen(port, (err) => {
			if(err){
				return console.log('something bad happend', err);
			}
			console.log('server is listening on', port);
		})
	}
}