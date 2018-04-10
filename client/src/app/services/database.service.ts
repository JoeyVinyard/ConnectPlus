import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DatabaseService {

	dbUrl = environment.serverUrl;

	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type':  'application/x-www-form-urlencoded',
		})
	};

	//Create user profile in firebase based on the User object. Returns a promise to the snapshot of the data posted, or an error message
	createUser(user: User): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.post(this.dbUrl+ "createUser", JSON.stringify(user), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	//Update user profile in firebase based on the User object. Returns promise to the snapshot of the data posted, or an error message
	updateUser(user: User): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.post(this.dbUrl+ "updateUser", JSON.stringify(user), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	//Update user profile in firebase based on the User object. Returns a promise to the snapshot of the data that was deleted, or an error message
	deleteUser(user: User): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.delete(this.dbUrl+ "deleteUser/"+user.uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	//Returns a promise to specific user based on the uid provided, or an error message.
	getUser(uid: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getUser/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	//Returns a promise to a list of users based on the uids provided, or an error message.
	getMultipleUsers(uids: String[]): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getUsers/"+uids.join("&"), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	//Returns a promsie to a list of all users, or an error message.
	getAllUsers(): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getAllUsers", this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getNearbyUsers(uid: string): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getNearbyUsers/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		})
	}
	getFacebookFriends(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getFacebookFriends/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getTwitterFollowees(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getTwitterFollowees/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getYoutubeFriends(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getYoutubeFriends/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getUsersWithCommonFacebookFriends(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getUsersWithCommonFacebookFriends/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	storeLocation(loc, uid): Promise<any>{
		return new Promise((resolve, reject) => {
			var locationObject = {
				lat: 0,
				lon: 0,
				uid: ""
			}
			if(!!loc){
				locationObject.lat = loc.latitude;
				locationObject.lon = loc.longitude;
				locationObject.uid = uid;
			}else{
				reject("Invalid location object");
			}
				
			this.http.post(this.dbUrl+ "storeLocation", JSON.stringify(locationObject), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		});
	}
	storeFacebookFriends(friends, uid): Promise<any>{
		return new Promise((resolve, reject) => {
			var friendsObject = {
				friends: [],
				uid: ""

			};
			if(!!friends){
				friendsObject.friends = friends;
				friendsObject.uid = uid;

			}else{
				reject("Invalid Array");
			}

			this.http.post(this.dbUrl+ "storeFacebookFriends", JSON.stringify(friendsObject), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		});
	}
	storeTwitterFollowees(followees, screenName, uid): Promise<any> {
		return new Promise((resolve, reject) => {
			console.log(uid);
			var followObject = {
				friends: [],
				uid: "",
				screenName
			};

			if(!!followees){
				followObject.friends = followees;
				followObject.uid = uid;
				if(!!screenName){
					followObject.screenName = screenName;
				}
			}else{
				reject("Invalid Array");
			}
			console.log(followObject);
			this.http.post(this.dbUrl+ "storeTwitterFollowees", JSON.stringify(followObject), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		});
	}
	getTwitterScreenName(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getTwitterScreenName/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"]){
					resolve(data["payload"]);
				}else{
					reject(data["err"]);
				}
			});
		})
	}
	getLocation(uid: String): Promise<any>{
		console.log("Getting location")
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getLocation/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	getClasses(uid: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getClasses/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"] || !data["err"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	addClass(uid: String, cl:String): Promise<any>{
		var classObject = {
			uid: uid,
			cl: cl
		}
		return new Promise((resolve, reject) => {
			this.http.post(this.dbUrl+ "addClass", JSON.stringify(classObject),this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	deleteClass(uid: String, cl: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.delete(this.dbUrl+ "deleteClass/"+uid+"/"+cl, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}

	getInterests(uid: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getInterests/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"] || !data["err"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	addInterest(uid: String, sub:String, inter:String): Promise<any>{
		var interestObject = {
			uid: uid,
			category: sub,
			inter: inter
		}
		console.log(interestObject)
		return new Promise((resolve, reject) => {
			
			this.http.post(this.dbUrl+ "addInterest", JSON.stringify(interestObject),this.httpOptions).subscribe((data) => {
				if(data["payload"]) {
					resolve(data["payload"]);
				}
				else{
					reject(data["err"]);
				}
			});
		})
	}
	
	deleteInterest(uid: String, sub:String, inter: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.delete(this.dbUrl+ "deleteInterest/"+uid+"/"+sub+"/"+inter, this.httpOptions).subscribe((data) => {
				console.log("inside")
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	// clearAllCatInterests(uid: String, sub:String): Promise<any>{
	// 	return new Promise((resolve, reject) => {
	// 		this.http.delete(this.dbUrl+ "clearAllCatInterests/"+uid+"/"+sub, this.httpOptions).subscribe((data) => {
	// 			console.log("inside")
	// 			if(data["payload"])
	// 				resolve(data["payload"]);
	// 			else
	// 				reject(data["err"]);
	// 		});
	// 	})
	// }
	storeYoutubeSubscribers(uid: String, access_token: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "storeYoutubeSubscribers/"+uid+"/"+access_token, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}

	getYoutubeSubscribers(uid: String){
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getYoutubeSubscriptions/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}

	getYoutubeStatus(uid: String){
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getYoutubeStatus/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	addFeedback(feedback:String): Promise<any>{
		var feedbackObject = {
			
			feedback: feedback
		}
		return new Promise((resolve, reject) => {
			this.http.post(this.dbUrl+ "addFeedback", JSON.stringify(feedbackObject),this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	storeBroadcast(uid, loc, broadcast): Promise<any>{
		return new Promise((resolve, reject) => {
			var broadcastObject = {
				lat: 0,
				lon: 0,
				uid: "",
				broadcast: ""
			}
			if(!!loc){
				broadcastObject.lat = loc.latitude;
				broadcastObject.lon = loc.longitude;
				broadcastObject.uid = uid;
				broadcastObject.broadcast = broadcast;
			}else{
				reject("Invalid broadcast object");
			}
			console.log(broadcastObject);
			this.http.post(this.dbUrl+ "storeBroadcast", JSON.stringify(broadcastObject), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		});
	}
	getNearbyBroadcasts(uid: string): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get(this.dbUrl+ "getNearbyBroadcasts/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		})
	}
	constructor(private http: HttpClient) {}

}
