const http = require('http')
const port = 3000
const assert = require('assert')
const requestHandler = (request, response) => {
	console.log(request.url);
	//console.log(request)
	assert.equal(true, false, 'true is true');
	response.end('Server works');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
	if(err){
		return console.log('something bad happend', err);
	}
	console.log('server is listening on ${port}');
	
})