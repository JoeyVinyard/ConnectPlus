var firebase = require('firebase');
var distanceCalc = require('./distanceCalc.js');
var config = require('./config.js');
var axios = require('axios');
firebase.initializeApp(config.fbConfig);
firebase.auth().signInWithEmailAndPassword("admin@connectpl.us", config.password);

var youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  timeout: 1000
});

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
		var feet = urlData[2];
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
					console.log("Distance to beat:", 710 * feet, "Selection:", feet);
					s.forEach((loc) => {
						var c2 = {
							lat: loc.val().lat,
							lon: loc.val().lon
						};
						var d = distanceCalc.getDistance(c1,c2);

						if(d <= (710 * feet) && loc.val().uid != uid){
							console.log("distance", d);
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
						if(users.val()[closeUser.uid] && (users.val()[closeUser.uid]).visibility){
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
			// console.log(userFriends);
			// console.log(user.val().uid);
			userFriends.forEach((friend) => {
				data.push(friend.name);

			});
			res.statusCode = 200;
			responseBody.payload = data;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			res.statusCode = 200;
			responseBody.payload = err;
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
						var commonFriend = false;
						matchFriends.forEach((friend) => {
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
	getInterests: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1]){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		firebase.database().ref("interests/"+uid).once("value").then((s) => {
			res.statusCode=200;
			if(s.val())
				responseBody.payload = s.val();
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
	addInterest: function(req, res, urlData){
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
			if(!data || !data.uid || !data.inter){
				res.statusCode = 400;
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			
			firebase.database().ref("interests/"+data.uid+"/"+data.category).push(data.inter).then(() => {
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
	
	deleteInterest: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		if(!urlData || !urlData[1] || !urlData[2] || !urlData[3]){
			res.statusCode = 400;
			responseBody.err = "No UID or Class provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		var sub = urlData[2];
		var inter = urlData[3];
		while(inter.includes("%20")){
			inter = inter.replace("%20", " ");
		}
		firebase.database().ref("interests/"+uid+"/"+sub).once("value").then((s) => {
			var ent = Object.entries(s.val());
			var found = false;
			for(var i = 0; i < ent.length; i++){
				if(ent[i][1] == inter){
					found = true;
					firebase.database().ref("interests/"+uid+"/"+ sub + "/" +ent[i][0]).remove().then(() => {
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

			if(!found){
				res.statusCode = 400;
				responseBody.payload = "Interest not found";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
		}).catch((err) => {
			console.error(err);
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		});
	},
	// clearAllCatInterests: function(req, res, urlData){
	// 	console.log("in the method")
	// 	var responseBody = Object.create(responseForm);
	// 	if(!urlData || !urlData[1] || !urlData[2]){
	// 		res.statusCode = 400;
	// 		responseBody.err = "No UID or Cat provided";
	// 		res.write(JSON.stringify(responseBody));
	// 		res.end();
	// 		return;
	// 	}
	// 	var uid = urlData[1];
	// 	var sub = urlData[2];
		
	// 	while(sub.includes("%20")){
	// 		sub = sub.replace("%20", " ");
	// 	}
	// 	console.log("nilu: ", sub);
	// 	firebase.database().ref("interests/"+uid).once("value").then((s) => {
	// 		var ent = Object.entries(s.val());
	// 		var found = false;
	// 		for(var i = 0; i < ent.length; i++){
	// 			if(ent[i][1] == sub){
	// 				found = true;
	// 				firebase.database().ref("interests/"+uid+"/"+ ent[i][0]).remove().then(() => {
	// 					res.statusCode = 200;
	// 					responseBody.payload = true;
	// 					res.write(JSON.stringify(responseBody));
	// 					res.end();
	// 				}).catch((err) => {
	// 					console.error(err);
	// 					responseBody.err = err;
	// 					res.statusCode = 400;
	// 					res.write(JSON.stringify(responseBody));
	// 					res.end();
	// 				})
	// 				break;
	// 			}
	// 		}

	// 		if(!found){
	// 			res.statusCode = 400;
	// 			responseBody.payload = "Interest not found";
	// 			res.write(JSON.stringify(responseBody));
	// 			res.end();
	// 			return;
	// 		}
	// 	}).catch((err) => {
	// 		console.error(err);
	// 		responseBody.err = err;
	// 		res.statusCode = 400;
	// 		res.write(JSON.stringify(responseBody));
	// 		res.end();
	// 		return;
	// 	});
	// },
	storeYoutubeSubscribers(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var subs = {};
		if(urlData.length < 3){
			responseBody.err = "No access token was given";
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		var uid = urlData[1];
		var access_token = urlData[2];
		if(!uid || !access_token){
			res.statusCode = 400;
			responseBody.err = "No UID or access_token provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		youtube.get("subscriptions?access_token="+access_token+"&part=snippet,contentDetails&mine=true&maxResults=5").then((channel) => {
			var subscriptions = channel.data.items;
			subscriptions.forEach((sub) => {
				subs[sub.snippet.resourceId.channelId] = sub.snippet.title;
			})
			if(channel.data.nextPageToken)
				getSubs(channel.data.nextPageToken);
		}).catch((err) => {
			res.statusCode = 400;
			responseBody.err = "No UID or access_token provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
			//console.log("Youtube Failed", err);
		})
		function getSubs(nextPage){
			youtube.get("subscriptions?access_token="+access_token+"&part=snippet,contentDetails&mine=true&pageToken="+nextPage).then((channel) => {
				var subscriptions = channel.data.items;
				subscriptions.forEach((sub) => {
					subs[sub.snippet.resourceId.channelId] = sub.snippet.title;
				});
				if(channel.data.nextPageToken){
					getSubs(channel.data.nextPageToken);
				}else{
					firebase.database().ref("subscriptions/"+uid).set(subs).then(() => {
						responseBody.payload = subs;
						res.statusCode = 200;
						res.write(JSON.stringify(responseBody));
						res.end();
					}).catch((err) => {
						responseBody.err = err;
						res.statusCode = 400;
						res.write(JSON.stringify(responseBody));
						res.end();
					})
				}
			}).catch((err) => {
				console.log("Youtube Failed", err);
			})
		}
	},
	getYoutubeSubscriptions(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var uid = urlData[1];
		if(!uid){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		firebase.database().ref("subscriptions/"+uid).once("value").then((s) => {
			if(s.val() == null){
				responseBody.err = "valid";
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			responseBody.payload = s.val();
			res.statusCode = 200;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
		})
	},
	getYoutubeStatus(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var uid = urlData[1];
		if(!uid){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		firebase.database().ref("subscriptions/"+uid).once("value").then((s) => {
			responseBody.payload = s.val();
			res.statusCode = 200;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
		})
	},
	deleteYoutubeData(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var uid = urlData[1];
		if(!uid){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		firebase.database().ref("subscriptions/"+uid).remove().then(() => {
			responseBody.payload = true;
			res.statusCode = 200;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
		})
	},
	addFeedback: function(req, res, urlData){
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
			if(!data || !data.feedback || data.feedback == ""){
				res.statusCode = 400;
				responseBody.err = "Data not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("feedback/").push(data.feedback).then(() => {
				res.statusCode = 200;
				responseBody.payload = data;
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}).catch((err) => {
				console.error(err);
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			})
		});
	},
	storeBroadcast: function(req, res, urlData){
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
			if(!data || !data.uid || data.broadcast == "" || data.time < 1){
				res.statusCode = 400;
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			var v = firebase.database().ref("broadcasts/").push(data);
			v.then((data) => {
				firebase.database().ref("broadcasts/" + v.key + "/broadcastID").set(v.key).then((data) => {
					console.log("All good in da hood");
					res.statusCode = 200;
					responseBody.payload = "OK";
					res.write(JSON.stringify(responseBody));
					res.end();	
					return;
				}).catch((err) => {
					console.error(err);
					responseBody.err = err;
					res.statusCode = 400;
					res.write(JSON.stringify(responseBody));
					res.end();
					return;
				})
				
			}).catch((err) => {
				console.log("Not too weird");
				console.error(err);
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			})
		});
			/*firebase.database().ref("broadcasts/").push(data).then(() => {
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
		});*/

	},
	getNearbyBroadcasts: function(req, res, urlData){
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
				firebase.database().ref("broadcasts").once("value").then((s) => {
					res.statusCode=200;
					var nearbyUids = [];
					var promises = [];

					s.forEach((loc) => {
						promises.push( new Promise((res, rej) => {
							console.log("Do we at least get in here?");
							var c2 = {
								lat: loc.val().lat,
								lon: loc.val().lon
							};
							var d = distanceCalc.getDistance(c1,c2);
						if(d <= 15840 ){//3 miles
							firebase.database().ref("users/" + loc.val().uid).once("value").then((broadcastUser) => {
								if(broadcastUser.val() == null){
									res.statusCode = 400;
									responseBody.err = "Invalid UID";
									res.write(JSON.stringify(responseBody));
									res.end();
									return;			
								}
								var obj = {
									subject: loc.val().subject,
									url: broadcastUser.val().url,
									fullName: broadcastUser.val().fullName,
									uid: loc.val().uid,
									distance: d,
									lat: loc.val().lat,
									lon: loc.val().lon,
									message: loc.val().broadcast,
									broadcastID: loc.val().broadcastID,
									responses: [],
									time: loc.val().time
								};
								if(loc.val().responses){
									/*I hate my life*/
									var responseList = [];
									var responsePromises = [];
									var responses = loc.val().responses;
									var responseKeys = Object.keys(responses);
									responseKeys.forEach((responseKey) => {
										var response = responses[responseKey];
										responsePromises.push( new Promise ((yay, boo) => {
											firebase.database().ref("users/" + response.uid).once("value").then((responseUser) => {
												responseList.push({
													url: responseUser.val().url,
													fullName: responseUser.val().fullName,
													uid: responseUser.val().uid,
													response: response.response,
													time: response.time
												});
												yay();
											}).catch((err) => {
												boo(err);
											});
										}));
									});

									Promise.all(responsePromises).then(() => {
										responseList.sort(function(a,b) {
											return a.time - b.time;
										})
										//responseList.reverse();
										obj.responses = responseList;	
										nearbyUids.push(obj);
										res();
									});
								} else {
									nearbyUids.push(obj);
									res();
								}
								
							}).catch((err) => {
								console.log(err);
								rej(err);
							});
						}else{
							res();							
						}

					}));
					})
					Promise.all(promises).then((then) => {
						nearbyUids.sort(function(a,b) {
							return b.time - a.time;
						});
						//nearbyUids.reverse();
						resolve(nearbyUids);
					}).catch((err) => {
						console.log(err);
						reject('err')
					});

				});

			}).then((closeBroadcasts) => {
				res.statusCode = 200;
				responseBody.payload = closeBroadcasts;
				res.write(JSON.stringify(responseBody));
				res.end();
			}).catch((err) => {
				res.statusCode = 400;
				responseBody.err = err;
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			})
		})
	},
	storeResponse: function(req, res, urlData){
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
			if(!data || !data.uid || !data.broadcastID || data.response == "" || data.time < 1){
				res.statusCode = 400;
				responseBody.err = "Data or UID not supplied";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("broadcasts/" + data.broadcastID + "/responses").push(data).then((data) => {
				res.statusCode = 200;
				responseBody.payload = data;
				res.write(JSON.stringify(responseBody));
				res.end();	
			}).catch((err) => {
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			});
		});	
	},
	scheduleVisibility: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var uid = urlData[1];
		var time = parseInt(urlData[2]);
		if(!uid || !time || time < 1){
			res.statusCode = 400;
			responseBody.err = "Invalid UID or Time provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		setTimeout(() => {
			firebase.database().ref("users/"+uid+"/visibility").set(true).then(() => {
				responseBody.payload = "success";
				res.statusCode = 200;
				res.write(JSON.stringify(responseBody));
				res.end();
			}).catch((err) => {
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			})
		}, time*60*60*1000)
	},
	storeMessage: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var body = "";
		req.on('data', function(data){
			body += data;
			if(body.length > 1e6){ 
				req.connection.destroy();
			}
		});
		req.on('end', function() {
			var data = JSON.parse(body);
			if(!data || !data.to || !data.from || !data.message){
				res.statusCode = 400;
				responseBody.err = "No UID or Time provided";
				res.write(JSON.stringify(responseBody));
				res.end();
				return;
			}
			firebase.database().ref("messages/"+data.from+"/"+data.to).push({fromMe: true, message: data.message}).then(() => {
				firebase.database().ref("messages/"+data.to+"/"+data.from).push({fromMe: false, message: data.message}).then(() => {
					responseBody.payload = "success";
					res.statusCode = 200;
					res.write(JSON.stringify(responseBody));
					res.end();
				}).catch((err) => {
					responseBody.err = err;
					res.statusCode = 400;
					res.write(JSON.stringify(responseBody));
					res.end();
				})
			}).catch((err) => {
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			})
		});
	},
	getMessages: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var uid = urlData[1];
		var thread = urlData[2];
		if(!uid){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		firebase.database().ref("messages/"+uid+"/").once("value").then((s) => {
			responseBody.payload = s.val();
			res.statusCode = 200;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
		})
	},
	getMessageThread: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var uid = urlData[1];
		var thread = urlData[2];
		if(!uid || !thread){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			return;
		}
		firebase.database().ref("messages/"+uid+"/"+thread).once("value").then((s) => {
			responseBody.payload = Object.values(s.val());
			res.statusCode = 200;
			res.write(JSON.stringify(responseBody));
			res.end();
		}).catch((err) => {
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
		})
	},
	initMessageThread: function(req, res, urlData){
		var responseBody = Object.create(responseForm);
		var uid = urlData[1];
		var thread = urlData[2];
		console.log("one")
		if(!uid || !thread){
			res.statusCode = 400;
			responseBody.err = "No UID provided";
			res.write(JSON.stringify(responseBody));
			res.end();
			console.log("two")
			return;
		}
		console.log("it reached here")
		firebase.database().ref("messages/"+uid+"/"+thread).set(" ").then((s) => {
			firebase.database().ref("messages/"+thread+"/"+uid).set(" ").then((s) => {
				responseBody.payload = Object.values(s.val());
				res.statusCode = 200;
				res.write(JSON.stringify(responseBody));
				res.end();
			}).catch((err) => {
				responseBody.err = err;
				res.statusCode = 400;
				res.write(JSON.stringify(responseBody));
				res.end();
			})
		}).catch((err) => {
			responseBody.err = err;
			res.statusCode = 400;
			res.write(JSON.stringify(responseBody));
			res.end();
		})
	}
}