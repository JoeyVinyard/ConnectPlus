const http = require('http');
const port = 3000

var firebase = require('firebase');
var config = require('./config.js');
firebase.initializeApp(config.fbConfig);
firebase.auth().signInWithEmailAndPassword("admin@connectpl.us", config.password);

const requestHandler = (request, response) => {
	var routeFunction = routeHandler[request.url.substring(1)];
	response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
	response.setHeader('Access-Control-Allow-Headers', 'content-type');
	routeFunction(request,response);
}

var routeHandler = {
	create: function(request, res){
		var body = "";
		request.on('data', function (data) {
			body += data;
			if(body.length > 1e6){ 
				request.connection.destroy();
			}
		});
		request.on('end', function () {
			var data = JSON.parse(body);
			if(!data){
				res.statusCode = 400;
				res.end();
			}
			firebase.database().ref("users").push(data).then(() => {
				res.statusCode = 200;
				res.end();
			}).catch((err) => {
				res.statusCode = 400;
				res.end();
			})
		});
	},
	update: function(request, res){
		var body = "";
		request.on('data', function (data) {
			body += data;
			if(body.length > 1e6){ 
				request.connection.destroy();
			}
		});
		request.on('end', function () {
			var data = JSON.parse(body);
			if(!data){
				res.statusCode = 400;
				res.end();
			}
			firebase.database().ref("users").orderByChild("uid").equalTo(data.uid).on("value", (snapshot) => {
				console.log(snapshot.ref.toString());
				res.end();
			});
			// firebase.database().ref("users").orderByChild("uid").equalTo(data.uid).ref.update(data).then(() => {
			// 	res.statusCode = 200;
			// 	res.end();
			// }).catch((err) => {
			// 	res.statusCode = 400;
			// 	res.end();
			// })
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