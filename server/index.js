const http = require('http');
const port = 3000

var firebase = require('firebase');
var config = require('./config.js');
firebase.initializeApp(config.fbConfig);
firebase.auth().signInWithEmailAndPassword("admin@connectpl.us", config.password);

const requestHandler = (request, response) => {
	var parsedUrl = request.url.substring(1).split('/');
	var routeFunction = routeHandler[parsedUrl[0]];
	response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
	response.setHeader('Access-Control-Allow-Headers', 'content-type');
	routeFunction(request,response, parsedUrl);
}

var routeHandler = {
	createUser: function(req, res, urlData){
		var body = "";
		req.on('data', function (data) {
			body += data;
			if(body.length > 1e6){ 
				req.connection.destroy();
			}
		});
		req.on('end', function () {
			var data = JSON.parse(body);
			if(!data || !data.uid){
				res.statusCode = 400;
				res.end();
				return;
			}
			firebase.database().ref("users/"+data.uid).set(data).then(() => {
				res.statusCode = 200;
			}).catch((err) => {
				console.error(err);
				res.statusCode = 400;
				res.end();
			})
		});
	},
	updateUser: function(req, res, urlData){
		var body = "";
		req.on('data', function (data) {
			body += data;
			if(body.length > 1e6){ 
				req.connection.destroy();
			}
		});
		req.on('end', function () {
			var data = JSON.parse(body);
			if(!data || !data.uid){
				res.statusCode = 400;
				res.end();
				return;
			}
			firebase.database().ref("users/"+data.uid).update(data).then(() => {
				res.statusCode = 200;
			}).catch((err) => {
				console.error(err);
				res.statusCode = 400;
				res.end();
			})
		});
	},
	deleteUser: function(req, res, urlData){
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("users/"+uid).remove().then(() => {
			res.statusCode = 200;
		}).catch((err) => {
			res.statusCode = 400;
			res.end();
			console.error(err);
		})
	},
	getUser: function(req, res, urlData){
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("users/"+uid).once("value").then((s) => {
			res.statusCode=200;
			res.end(JSON.stringify(s));
			return;
		}).catch((err) => {
			console.error(err);
		});
	}
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
	if(err){
		return console.log('something bad happend', err);
	}
	console.log('server is listening on', port);
	
})