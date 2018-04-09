import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DatabaseService {

	dbUrl = "http://localhost:3000";

	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type':  'application/x-www-form-urlencoded',
		})
	};

	//Create user profile in firebase based on the User object. Returns a promise to the snapshot of the data posted, or an error message
	createUser(user: User): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.post("http://localhost:3000/createUser", JSON.stringify(user), this.httpOptions).subscribe((data) => {
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
			this.http.post("http://localhost:3000/updateUser", JSON.stringify(user), this.httpOptions).subscribe((data) => {
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
			this.http.delete("http://localhost:3000/deleteUser/"+user.uid, this.httpOptions).subscribe((data) => {
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
			this.http.get("http://localhost:3000/getUser/"+uid, this.httpOptions).subscribe((data) => {
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
			this.http.get("http://localhost:3000/getUsers/"+uids.join("&"), this.httpOptions).subscribe((data) => {
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
			this.http.get("http://localhost:3000/getAllUsers", this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getNearbyUsers(uid: string): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getNearbyUsers/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		})
	}
	getFacebookFriends(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getFacebookFriends/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getTwitterFollowees(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getTwitterFollowees/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getYoutubeFriends(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getYoutubeFriends/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	getUsersWithCommonFacebookFriends(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getUsersWithCommonFacebookFriends/"+uid, this.httpOptions).subscribe((data) => {
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
				
			this.http.post("http://localhost:3000/storeLocation", JSON.stringify(locationObject), this.httpOptions).subscribe((data) => {
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

			this.http.post("http://localhost:3000/storeFacebookFriends", JSON.stringify(friendsObject), this.httpOptions).subscribe((data) => {
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
			this.http.post("http://localhost:3000/storeTwitterFollowees", JSON.stringify(followObject), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		});
	}
	getTwitterScreenName(uid: String): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getTwitterScreenName/"+uid, this.httpOptions).subscribe((data) => {
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
			this.http.get("http://localhost:3000/getLocation/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	getClasses(uid: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getClasses/"+uid, this.httpOptions).subscribe((data) => {
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
			this.http.post("http://localhost:3000/addClass", JSON.stringify(classObject),this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	deleteClass(uid: String, cl: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.delete("http://localhost:3000/deleteClass/"+uid+"/"+cl, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}

	getInterests(uid: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getInterests/"+uid, this.httpOptions).subscribe((data) => {
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
			
			this.http.post("http://localhost:3000/addInterest", JSON.stringify(interestObject),this.httpOptions).subscribe((data) => {
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
			this.http.delete("http://localhost:3000/deleteInterest/"+uid+"/"+sub+"/"+inter, this.httpOptions).subscribe((data) => {
				console.log("inside")
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	storeYoutubeSubscribers(uid: String, access_token: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/storeYoutubeSubscribers/"+uid+"/"+access_token, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}

	getYoutubeSubscribers(uid: String){
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getYoutubeSubscriptions/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}

	getYoutubeStatus(uid: String){
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getYoutubeStatus/"+uid, this.httpOptions).subscribe((data) => {
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
			this.http.post("http://localhost:3000/addFeedback", JSON.stringify(feedbackObject),this.httpOptions).subscribe((data) => {
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
			this.http.post("http://localhost:3000/storeBroadcast", JSON.stringify(broadcastObject), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		});
	}
	getNearbyBroadcasts(uid: string): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getNearbyBroadcasts/"+uid, this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		})
	}
	storeBroadcastRespone(uid, broadcastID, response: string){
		return new Promise((resolve, reject) => {
			var responseObject = {
				uid: uid,
				broadcastID: broadcastID,
				response: response
			}

			this.http.post("http://localhost:3000/storeBroadcastResponse", JSON.stringify(responseObject), this.httpOptions).subscribe((data) => {
				if(data["payload"])
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	constructor(private http: HttpClient) {}

}
