const http = require('http');
const port = 3000

var firebase = require('firebase');
var config = require('./config.js');
firebase.initializeApp(config.fbConfig);
firebase.auth().signInWithEmailAndPassword("admin@connectpl.us", config.password);

var responseForm = {
	err: "",
	payload: {}
}

const requestHandler = (request, response) => {
	var parsedUrl = request.url.substring(1).split('/');
	console.log(parsedUrl);
	var routeFunction = routeHandler[parsedUrl[0]];
	response.setHeader("Access-Control-Allow-Origin", request.headers.origin, 'always');
	response.setHeader('Access-Control-Allow-Headers', 'content-type');
	routeFunction(request,response, parsedUrl);
}

var routeHandler = {
	createUser: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
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
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("users/"+data.uid).set(data).then(() => {
				res.statusCode = 200;
				responseBody.payload = data;
				res.write(JSON.stringify(responseBody));
				res.end();
			}).catch((err) => {
				console.error(err);
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			})
		});
	},
	updateUser: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
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
				responseBody.err = "Data or UID not provided";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("users/"+data.uid).update(data).then(() => {
				res.statusCode = 200;
				responseBody.payload = data;
				res.write(JSON.stringify(responseBody));
				res.end();
			}).catch((err) => {
				console.error(err);
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			})
		});
	},
	deleteUser: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("users/"+uid).remove().then(() => {
			console.log("finsihed");
			res.statusCode = 200;
			responseBody.payload = true;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			res.statusCode = 400;
			responseBody.err = err;
			res.write(JSON.stringify(responseBody));
			res.end();
			console.error(err);
		})
	},
	getUser: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("users/"+uid).once("value").then((s) => {
			res.statusCode=200;
			responseBody.payload = s.val();
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}).catch((err) => {
			res.statusCode = 400;
			responseBody.err = err;
			res.write(JSON.stringify(responseBody));
			res.end()
			console.error(err);
		});
	},
	getUsers: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uids = urlData[1].split("&");
		firebase.database().ref("users").once("value").then((s) => {
			var data = [];
			uids.forEach((uid) => {
				if(s.val()[uid])
					data.push(s.val()[uid]);
			})
			if(data.length == 0){
				res.statusCode = 400;
				res.end();
			}
			res.statusCode = 200;
			responseBody.payload = data;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			res.statusCode = 400;
			responseBody.err = err;
			res.write(JSON.stringify(responseBody));
			res.end();
		});
	},
	getAllUsers: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		firebase.database().ref("users").once("value").then((s) => {
			res.statusCode = 200;
			responseBody.payload = s.val();
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			res.statusCode = 400;
			responseBody.err = err;
			res.write(JSON.stringify(responseBody));
			res.end();
		})
	},
	storeLocation: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
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
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("locations/"+data.uid).set(data).then(() => {
				res.statusCode = 200;
				responseBody.payload = data;
				res.write(JSON.stringify(responseBody));
				res.end();
			}).catch((err) => {
				console.error(err);
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			})
		});
	},
	getLocation: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("locations/"+uid).once("value").then((s) => {
			res.statusCode=200;
			responseBody.payload = s.val();
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}).catch((err) => {
			res.statusCode = 400;
			responseBody.err = err;
			res.write(JSON.stringify(responseBody));
			res.end()
		});
	},
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
	if(err){
		return console.log('something bad happend', err);
	}
	console.log('server is listening on', port);
	
})