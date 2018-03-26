var firebase = require('firebase');
var distanceCalc = require('./distanceCalc.js');
var config = require('./config.js');
firebase.initializeApp(config.fbConfig);
firebase.auth().signInWithEmailAndPassword("admin@connectpl.us", config.password);

var responseForm = {
	err: "",
	payload: {}
}

module.exports = {
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
				return;
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
	getNearbyUsers: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("locations/"+uid).once("value").then((baseLocation) => {
			if(baseLocation.val() == null){
				res.statusCode = 400;
				responseBody.err = "No Location found";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			var c1 = {
				lat: baseLocation.val().lat,
				lon: baseLocation.val().lon
			}
			var p = new Promise((resolve, reject) => {
				firebase.database().ref("locations").once("value").then((s) => {
					res.statusCode=200;
					var nearbyUids = [];
					s.forEach((loc) => {
						var c2 = {
							lat: loc.val().lat,
							lon: loc.val().lon
						};
						var d = distanceCalc.getDistance(c1,c2);
						if(d <= 15840 && loc.val().uid != uid){//3 miles
							nearbyUids.push({
								uid: loc.val().uid,
								distance: d,
								lat: loc.val().lat,
								lon: loc.val().lon
							});
						}
					})
					resolve(nearbyUids);
				}).catch((err) => {
					reject(err);
				});
			}).then((closeUsers) => {
				firebase.database().ref("users").once("value").then((users) => {
					var data = [];
					closeUsers.forEach((closeUser) => {
						//Nirali fix the spelling of visibility
						if(users.val()[closeUser.uid] && (users.val()[closeUser.uid]).visibility == 100){
							data.push(users.val()[closeUser.uid]);
							data[data.length-1].distance = closeUser.distance;
							data[data.length-1].lat = closeUser.lat;
							data[data.length-1].lon = closeUser.lon;
						}
					})
					res.statusCode = 200;
					responseBody.payload = data;
					res.write(JSON.stringify(responseBody));
					res.end();
				})
			}).catch((err) => {
				res.statusCode = 400;
				responseBody.err = err;
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			})
		})
	},
	getFacebookFriends: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("facebook-friends/"+uid).once("value").then((user) => {
			var data = [];
			//console.log(user);
			if(!user.val()){
				res.statusCode = 200;
				responseBody.payload = data;
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			var userFriends = user.val().friends;
			var data = [];
			//var friendMap = new Map();

			userFriends.forEach((friend) => {
				data.push(friend.name);

			});

			res.statusCode = 200;
			responseBody.payload = data;
			res.write(JSON.stringify(responseBody));
			res.end();
		});
	},
	getTwitterFollowees: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("twitter-followees/"+uid).once("value").then((user) => {
			var data = [];
			if(!user.val()){
				res.statusCode = 200;
				responseBody.payload = data;
				res.write(JSON.stringify(responseBody));
				res.end();	
				return;
			}
			var userFollowees = user.val().friends;

			//var friendMap = new Map();
			userFollowees.forEach((followee) => {
				data.push(followee);

			});

			res.statusCode = 200;
			responseBody.payload = data;
			res.write(JSON.stringify(responseBody));
			res.end();
		});
	},

	getUsersWithCommonFacebookFriends: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("facebook-friends/"+uid).once("value").then((user) => {
			var userFriends = user.val().friends;
			var friendMap = new Map();
			userFriends.forEach((friend) => {

				friendMap.set(friend.name, friend.name);
			});

			var p = new Promise((resolve, reject) => {
				firebase.database().ref("facebook-friends").once("value").then((s) => {
					res.statusCode=200;
					var commonFriendUIDs = [];
					s.forEach((nextUser) => {
						var matchFriends = nextUser.val().friends;
						console.log(nextUser.val().uid);
						var commonFriend = false;
						matchFriends.forEach((friend) => {
							console.log(friend);
							console.log(friend.id);
							console.log(friendMap.get(friend.name));
							//console.log(friendMap);
							if(friendMap.get(friend.name)){
								commonFriend = true;
							}
						})
						/*
						for(friend in matchFriends){
							console.log(friend);

							if(friendMap.get(friend)){
								commonFriend = true;
								break;
							}
						}
						*/
						if(commonFriend && nextUser.val().uid != uid){//3 miles
							firebase.database().ref("locations/" + nextUser.val().uid).once("value").then((matchLocation) => {
								commonFriendUIDs.push({
									uid: matchLocation.val().uid,
									lat: matchLocation.val().lat,
									lon: matchLocation.val().lon
								});	
							});
							
						}
					});
					resolve(commonFriendUIDs);
				}).catch((err) => {
					reject(err);
				});
			}).then((closeUsers) => {
				firebase.database().ref("users").once("value").then((users) => {
					var data = [];
					closeUsers.forEach((closeUser) => {
						if(users.val()[closeUser.uid]){
							data.push(users.val()[closeUser.uid]);
							data[data.length-1].distance = closeUser.distance;
							data[data.length-1].lat = closeUser.lat;
							data[data.length-1].lon = closeUser.lon;
						}
					})
					if(data.length == 0){
						//console.log("No matches were found");
						res.statusCode = 400;
						res.end();
						return;
					}
					//console.log(data);
					res.statusCode = 200;
					responseBody.payload = data;
					res.write(JSON.stringify(responseBody));
					res.end();
				})
			}).catch((err) => {
				console.log(err);
				res.statusCode = 400;
				responseBody.err = err;
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			})
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

	storeFacebookFriends: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var body = "";
		// console.log(req);
		req.on('data', function(data){
			body += data;
			if(body.length > 1e6){ 
				req.connection.destroy();
			}
		});
		req.on('end', function() {
			var data = JSON.parse(body);
			if(!data || !data.uid){
				res.statusCode = 400;
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("facebook-friends/" + data.uid).set(data).then(() => {
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
	storeTwitterFollowees: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var body = "";
		// console.log(req);
		req.on('data', function(data){
			body += data;
			if(body.length > 1e6){ 
				req.connection.destroy();
			}
		});
		req.on('end', function() {
			var data = JSON.parse(body);
			if(!data || !data.uid){
				res.statusCode = 400;
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("twitter-followees/" + data.uid).set(data).then(() => {
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
	getTwitterScreenName(req, res, urlData){

		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("twitter-followees/"+uid).once("value").then((s) => {
			res.statusCode=200;
			responseBody.payload = s.val().screenName;
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
	getClasses: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("classes/"+uid).once("value").then((s) => {
			res.statusCode=200;
			if(s.val())
				responseBody.payload = Object.values(s.val());
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}).catch((err) => {
			res.statusCode = 400;
			responseBody.err = err;
			console.log(err);
			res.write(JSON.stringify(responseBody));
			res.end()
		});
	},
	addClass: function(req, res, urlData){
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
			if(!data || !data.uid || !data.cl){
				res.statusCode = 400;
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("classes/"+data.uid).push(data.cl).then(() => {
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
	deleteClass: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1] || !urlData[2]){
			res.statusCode = 400;
			responseBody.err = "No UID or Class provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		var cl = urlData[2];
		cl = cl.replace("%20", " ");
		firebase.database().ref("classes/"+uid).once("value").then((s) => {
			var ent = Object.entries(s.val());
			for(var i = 0; i < ent.length; i++){
				if(ent[i][1] == cl){
					firebase.database().ref("classes/"+uid+"/"+ent[i][0]).remove().then(() => {
						res.statusCode = 200;
						responseBody.payload = true;
						res.write(JSON.stringify(responseBody));
						res.end();
					}).catch((err) => {
						console.error(err);
						responseBody.err = err;
						res.statusCode = 400;
						res.write(JSON.stringify(responseBody));
						res.end();
					})
					break;
				}
			}
		}).catch((err) => {
			console.error(err);
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
		});
	},
}