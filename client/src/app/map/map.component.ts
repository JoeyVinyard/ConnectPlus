import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { Commonalities } from '../services/commonalities';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';
import { ClassesService } from '../services/classes.service';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	lat: number = this.lat;
	lng: number = this.lng;

	locationFound = false;
	editMood = false;
	editRange = false;
	viewBroadcasts = false;
	newBroadcast = false;
	filterBroadcast = false;

	viewMessages = false;

	testArray = [1, 2, 3, 4, 5, 6]

	selectedBroadcast: any = {};
	broadcastText = "";
	responseText = "";
	broadcasts = [];
	filteredBroadcasts = [];
	broadcastResponses = [];
	nearbyUsers = [];
	filteredUsers = [];
	displayedUser: any = {};
	facebookCommon: number = 0;
	twitterCommon: number = 0;
	blackboardCommon: number = 0;
	youtubeCommon: number = 0;
	interestCommon: number = 0;

	interestObject: any = {};
	interestKeys = [];

	specificInterest = "";
	filterInterest = "";
	currentFilter = "";
	currentFilterArray = [];

	broadcastCategory = "";
	broadInterests = [];
	broadClasses = [];

	commonMap = new Map();
	CommonUsersList = [];
	CommonUsersListtemp = [];

	temp;
	holder;

	refreshMap() {
		this.auth.getUser().then((u) => {
			this.db.getNearbyUsers(u.uid).then((nearbyUsers) => {
				console.log("Nearby:", nearbyUsers);
				this.generateCommonMap();
				this.nearbyUsers = nearbyUsers;
				//this.filteredUsers = nearbyUsers; //copy of users for filtering ONLY
				this.maintainFilter();

			}).catch((err) => {
				console.error(err);
			})
		})
	}

	toggleMood() {
		this.editMood = !this.editMood;
	}

	toggleRange() {
		this.editRange = !this.editRange;
	}

	toggleBroadcasts() {
		this.viewBroadcasts = !this.viewBroadcasts;
		if (this.viewMessages) {
			this.viewMessages = false;
		}

		this.db.getInterests(this.model.user.uid).then((interests) => {
			this.interestObject = interests;
			this.interestKeys = Object.keys(this.interestObject);
			console.log(this.interestKeys)
			//this.getArrayOfInterestKeys();
		}).catch((err) => {
			console.log(err);
		})

		this.db.getClasses(this.model.user.uid).then((classes) => {
			this.broadInterests = classes;
		}).catch((err) => {
			console.log(err);
		})
	}

	toggleMessages() {
		this.viewMessages = !this.viewMessages;
		if (this.viewBroadcasts) {
			this.viewBroadcasts = false;
		}
	}

	toggleNewBroadcast() {
		this.newBroadcast = !this.newBroadcast;
		if (this.filterBroadcast) {
			this.filterBroadcast = false;
		}
	}

	toggleFilterBroadcast() {
		this.filterBroadcast = !this.filterBroadcast;
		if (this.newBroadcast) {
			this.newBroadcast = false;
		}
	}

	updateBroadInterests(){
		if(this.broadcastCategory != 'blackboard'){
			this.broadInterests = Object.values(this.interestObject[this.broadcastCategory]);
		}
		else{
			this.broadInterests = this.broadClasses;
		}
		
		//console.log("UpdateBroadInterests")
	}

	refreshBroadcasts(){
		this.db.getNearbyBroadcasts(this.model.user.uid.toString()).then((broadcasts) => {
				this.broadcasts = broadcasts;
				this.filteredBroadcasts = broadcasts;
				console.log(broadcasts);
			});
	}

	model = {
		user: new User(),
		moodStatus: "",
		// filterSports: false,
		// filterMusic: false,
		// filterFood: false,
		// filterFacebook: false,
		// filterTwitter: false,
		// filterLinkedIn: false,
		// filterBlackBoard: false
	}
	errors = {
		mood: ""
	}

	commonalities = {
		commonalities: new Commonalities(),
	}



	MoodStatus = "Mood Status";

	moodChange() {
		//console.log(this.model);
		this.model.user.moodStatus = this.model.moodStatus;
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				//console.log(data);
				this.errors.mood = "Your mood status has been updated!"
				localStorage.setItem("localMood", this.model.user.moodStatus);
			}).catch((err) => {
				console.error(err);
				this.errors.mood = "Your mood status has NOT been updated!"

				//Form rejected for some reason
			})
		});


	}

	//ZOOM VALUE FOR MAP
	zoom: number = 15;
	currentZoom: number = 15;

	zoomMap() {
		this.zoom = this.currentZoom;

	}

	userVisible = false;
	vis;
	viewUser(user: any = {}) {
		this.userVisible = true;
		this.displayedUser = user;
		this.displayedUser.distanceInMiles = Math.round((this.displayedUser.distance / 5280) * 100) / 100;
		if (isNaN(this.displayedUser.distanceInMiles))
			this.displayedUser.distanceInMiles = 0;
		this.vis = this.commonMap.get(user.uid);

		this.displayedUser.commons = this.vis.FB + ": " + this.vis.facebookNum
			+ "  " + this.vis.TW + ": " + this.vis.twitterNum
			+ "  " + this.vis.BB + ": " + this.vis.blackboardNum
			+ "  " + this.vis.YT + ": " + this.vis.youtubeNum;
			console.log("is there anything here", this.vis.interestSub)
		var keys = Object.keys(this.vis.interestSub);

		keys.forEach((gg) => {
			this.displayedUser.commons = this.displayedUser.commons 
				+ "  " + gg + ": " + this.vis.interestSub.get(gg);


		});
	}

	closeUser() {
		this.userVisible = false;
	}

	filterVisible = false;

	viewFilter() {
		this.filterVisible = true;
	}

	filterSports = false;
	filterMusic = false
	filterFood = false
	filterFacebook = false
	filterTwitter = false
	filterLinkedIn = false
	filterBlackBoard = false

	closeFilter() {
		this.filterVisible = false;
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				//console.log(data);

			}).catch((err) => {
				console.error(err);

			})

		});
	}

	toggleFilter() {
		this.filterVisible = true;
		if (this.filterVisible) {
			this.db.getInterests(this.model.user.uid).then((interests) => {
				this.interestObject = interests;
				this.interestKeys = Object.keys(this.interestObject);
				//console.log(this.interestKeys)
				//this.getArrayOfInterestKeys();
			}).catch((err) => {
				console.log(err);
			})
		}
	}

	nearbyPin = ("../../assets/NearbyPin.png");
	userPin = ("../../assets/UserPin.png");

	//Invisibility Toggle 0=Invisible, 4hour, 12hour, 24hour, 100=Visible
	visibility;
	setVisible(number) {

		this.visibility = number;
		this.model.user.visibility = !number;
		localStorage.setItem("localVisibility", number);

		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				this.db.scheduleVisibility(this.model.user.uid, number).then(() => {
					
				}).catch((err) => {
					console.error(err);
				})
			}).catch((err) => {
				console.error(err);
			})
		});



	}

	addFilter() {
		if (this.currentFilterArray.indexOf(this.currentFilter) == -1) {
			this.currentFilterArray.push(this.currentFilter);
		}

		//console.log("Filter Added: " + this.currentFilter);
		if (this.currentFilter == "Facebook") {
			this.model.user.filterFacebook = true;
			this.facebookFilter()
		}
		else if (this.currentFilter == "Twitter") {
			this.model.user.filterTwitter = true;
			this.twitterFilter();
		}
		else if (this.currentFilter == "Youtube") {
			this.model.user.filterYoutube = true;
			this.youtubeFilter();
			//do something eventually
		}
		else if (this.currentFilter == "Blackboard") {
			this.model.user.filterBlackBoard = true;
			this.blackboardFilter();
		}
		else {
			//interest filtering
			this.model.user.filteredInterests.push(this.currentFilter);
			this.filterUsersBasedOnInterests(this.currentFilter, 1);
		}
	}

	removeFilter(filter) {
		//console.log("Filter Removed: " + filter);
		// var index = this.currentFilterArray.indexOf(filter);
		// this.currentFilterArray.splice(index, 1);
		if (filter == "Facebook") {
			this.model.user.filterFacebook = false;
			this.maintainFilter();
		}
		else if (filter == "Twitter") {
			this.model.user.filterTwitter = false;
			this.maintainFilter();
			// this.twitterFilter();
		}
		else if (filter == "Youtube") {
			this.model.user.filterYoutube = false;
			this.maintainFilter();
		}
		else if (filter == "Blackboard") {
			this.model.user.filterBlackBoard = false;
			this.maintainFilter();
			// this.blackboardFilter();
		}
		else {
			//interest filtering
			var index = this.model.user.filteredInterests.indexOf(filter);
			this.model.user.filteredInterests.splice(index, 1);
			this.maintainFilter();
		}
	}

	facebookFilter() {
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				//console.log("from facebook filter ", data);

				if (this.model.user.filterFacebook) {
					this.filterUsersBasedOnFacebook(0);

				}
				else {
					this.maintainFilter();
				}

			}).catch((err) => {
				console.error(err);
			})
		});
	}
	twitterFilter() {
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				//console.log(data);

				if (this.model.user.filterTwitter) {
					this.filterUsersBasedOnTwitter(0);
				}
				else {
					this.maintainFilter();
				}

			}).catch((err) => {
				console.error(err);
			})
		});
	}
	youtubeFilter() {
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				//console.log(data);

				if (this.model.user.filterYoutube) {
					this.filterUsersBasedOnYoutube(0);
				}
				else {
					this.maintainFilter();
				}

			}).catch((err) => {
				console.error(err);

			})

		});
	}
	blackboardFilter() {
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				//console.log(data);

				if (this.model.user.filterBlackBoard) {
					this.filterUsersBasedOnBlackboard(0);
				}
				else {
					this.maintainFilter();
				}

			}).catch((err) => {
				console.error(err);

			})

		});
	}

	maintainFilter() {
		//this.generateCommonMap();
		this.filteredUsers = this.nearbyUsers;
		this.currentFilterArray = [];
		var count = 0;

		if (this.model.user.filterFacebook) {
			this.currentFilterArray.push("Facebook");
			this.filterUsersBasedOnFacebook(0);
			count++;
		}
		if (this.model.user.filterTwitter) {
			this.currentFilterArray.push("Twitter")
			this.filterUsersBasedOnTwitter(0);
			count++;
		}
		if (this.model.user.filterYoutube) {
			this.currentFilterArray.push("Youtube")
			this.filterUsersBasedOnYoutube(0);
			count++;
		}
		if (this.model.user.filterBlackBoard) {
			this.currentFilterArray.push("Blackboard")
			this.filterUsersBasedOnBlackboard(0);
			count++;
		}

		if (this.model.user.filteredInterests.length != 0) {
			for (var i = 0; i < this.model.user.filteredInterests.length; i++) {
				if (this.model.user.filteredInterests[i] != "") {
					this.currentFilterArray.push(this.model.user.filteredInterests[i]);
					this.filterUsersBasedOnInterests(this.model.user.filteredInterests[i], 1);
					count++;
				}
			}
		}

		if (count == 0) {
			this.filteredUsers = this.nearbyUsers;
		}
	}

	particlesConfig;
	submitted = false;


	localStorage() {
		localStorage.setItem("localVisibility", String(this.visibility));
		localStorage.setItem("localMood", this.model.user.moodStatus);
	}


	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService, public loc: LocationService) {


		this.auth.isAuthed().then((user) => {
			console.log("Authed:", user)
			this.model.user.uid = user.uid;
		});


		this.auth.getUser().then((user) => {

			//this.localStorage();
			this.db.getUser(user.uid).then((userData) => {
				this.model.user = userData;

				this.visibility = localStorage.getItem("localVisibility");
				this.model.moodStatus = localStorage.getItem("localMood");
				//console.log(userData)
			})
			this.generateCommonMap();

		});

		this.auth.getUser().then((user) => {
			if (localStorage.getItem("localVisibility") == null || localStorage.getItem("localMood") == null) { //only call Database if necessary
				this.db.getUser(user.uid).then((userData) => {
					console.log("localStorage Missing");
					this.model.user = userData;
					//console.log(userData)
					this.visibility = this.model.user.visibility;
					this.model.moodStatus = userData.moodStatus;
					this.localStorage();
					this.generateCommonMap();
				})
			}
		});
		loc.getLocation().then((l) => {
			console.log("retrieved the correct location");
			this.auth.getUser().then((u) => {
			this.db.storeLocation(l, u.uid).then((d) => {
				this.lat = l.latitude;
				this.lng = l.longitude;
				this.locationFound = true;
				this.loadLocationDependentData(l);
			});
		});
			
			//console.log("reeeeeeeeeee")
			
		});

		
		setTimeout(() => {
			if(!this.locationFound){
				db.getLocation(this.model.user.uid).then((l) => {
					this.lat = l.lat
					this.lng = l.lon;
					console.log(l);
					this.loadLocationDependentData(l);
				});
			}
		}, 3000);
		
		// this.generateCommonMap();
		// this.auth.isAuthed().then((user) => {
		//   console.log("Authed:",user)
		//   this.model.user.uid = user.uid;
		// });  
	}

	ngOnInit() {
	}

	loadLocationDependentData(l){
		this.auth.getUser().then((u) => {

			this.db.getTwitterFollowees(u.uid).then((twitterFollowees) => {
						//console.log("Followees: ", twitterFollowees);
					});
			this.db.getNearbyBroadcasts(u.uid).then((broadcasts) => {
				this.broadcasts = broadcasts;
				this.filteredBroadcasts = broadcasts;
				console.log(broadcasts);
			});
			this.db.getNearbyUsers(u.uid).then((nearbyUsers) => {
				console.log("Nearby:", nearbyUsers);
				this.nearbyUsers = nearbyUsers;
				this.maintainFilter();
			}).catch((err) => {
				console.error(err);
			})
		}).catch((e) => {
			console.error(e);
		});
	}

	filterUsersBasedOnInterests(interest, num:number) {
		var filterUsersArray = [];
		var modelInterests = [];
		var userInterests = [];
		//console.log("this is the interet that was inputed", interest)
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.db.getInterests(this.model.user.uid).then((mi) => {
					/*if(typeof mi !== 'undefined'){*/
					if (Object.keys(mi).indexOf(interest) != -1) {

						modelInterests = Object.values(mi[interest]);
						// console.log("MI: " +modelInterests;
					}
				})
				//console.log(modelInterests);
				this.filteredUsers.forEach((user) => {
					var match = false;
					this.db.getInterests(user.uid).then((ui) => {
						if (ui != null) {
							//this.holder = this.commonMap.get(user.uid);

							if (Object.keys(ui).indexOf(interest) != -1) {

								userInterests = Object.values(ui[interest]);
								// console.log("UI: " +userInterests);
							}
						}
						else{ //if null, empty out the list
							userInterests = [];
						}
						this.interestCommon = 0;
						for (var i = 0; i < modelInterests.length; i++) {
							for (var j = 0; j < userInterests.length; j++) {
								if (modelInterests[i] == userInterests[j]) {
									match = true;
									this.interestCommon = this.interestCommon +1;
									//console.log("they are the same" , userInterests[j])
									//break;
								}
							}
						}
						(this.commonMap.get(user.uid)).interestSub.set(interest, this.interestCommon)
						//console.log(interest, " ", this.interestCommon)
						if (match) {
							filterUsersArray.push(user);
						}
						resolve(filterUsersArray);
					}).catch((err) => {
						console.log(err);
						reject(err);
					});
				});
			}).then((users: any) => {
				if (!num) {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			}
			else{

			}
			});
		}
	}

	filterUsersBasedOnFacebook(num: number) {
		return new Promise((mainResolve, mainReject) => {
			var filterUsersArray = [];
			if (true /*check facebook thing*/) {

				this.db.getFacebookFriends(this.model.user.uid).then((friends) => {
					var friendMap = new Map();

					friends.forEach((friend) => {
						friendMap.set(friend, 1);

					});
					var p = new Promise((resolve, reject) => {
						this.filteredUsers.forEach((user) => {
							//reset all commonality values
							this.facebookCommon = 0;
							(this.commonMap.get(user.uid)).FB = "Facebook";
							(this.commonMap.get(user.uid)).facebookNum = 0;

							this.db.getFacebookFriends(user.uid).then((nearbyFriend) => {
								var match = false;

								nearbyFriend.forEach((friend) => {
									if (friendMap.get(friend)) {
										match = true;
										this.facebookCommon = this.facebookCommon + 1;
										
										(this.commonMap.get(user.uid)).facebook = true;
										(this.commonMap.get(user.uid)).FB = "Facebook";
									}
								});
								
								if (match) {
									(this.commonMap.get(user.uid)).facebookNum = this.facebookCommon;
									filterUsersArray.push(user);
								}
								resolve(filterUsersArray);

							}).catch((err) => {
								console.log(err);
								reject(err);
							});
							//this.holder.facebookNum = 0;
							//this.holder.facebookNum = (this.facebookCommon /2);
						});
					}).then((users: any) => {
						if (!num) {
							this.filteredUsers = filterUsersArray;
							console.log("Filtered Users Facebook:", filterUsersArray);
						}
						else {
							//console.log("Facebook Filtering Done")
							
						}
						mainResolve("Facebook")
					});
				}).catch((err) => {
					console.error(err);
				});
			}
		});
	}

	filterUsersBasedOnTwitter(num: number) {
		return new Promise((mainResolve, mainReject) => {
			var filterUsersArray = [];
			if (true) {
				this.db.getTwitterFollowees(this.model.user.uid).then((followees) => {
					var followeeMap = new Map();

					followees.forEach((followee) => {
						followeeMap.set(followee, 1);
					});
					var p = new Promise((resolve, reject) => {
						this.filteredUsers.forEach((user) => {
							this.twitterCommon = 0;
							(this.commonMap.get(user.uid)).TW = "Twitter";

							this.db.getTwitterFollowees(user.uid).then((nearbyFollowee) => {
								var match = false;

								nearbyFollowee.forEach((followee) => {
									if (followeeMap.get(followee)) {
										match = true;
										this.twitterCommon = this.twitterCommon + 1;
										(this.commonMap.get(user.uid)).twitter = true;
										(this.commonMap.get(user.uid)).TW = "Twitter";
									}
								});
								(this.commonMap.get(user.uid)).twitterNum = this.twitterCommon;

								if (match) {
									filterUsersArray.push(user);
								}
								resolve(filterUsersArray);
							}).catch((err) => {
								console.log(err);
								reject(err);
							});
						});
					}).then((users: any) => {
						if (!num) {
							this.filteredUsers = filterUsersArray;
							console.log("Filtered Users:", filterUsersArray);
						}
						else {
							
						}
						mainResolve("Twitter")
					});
				}).catch((err) => {
					console.error(err);
				});
			}
		})
	}

	filterUsersBasedOnYoutube(num: number) {
		return new Promise((mainResolve, mainReject) => {
			var filterUsersArray = [];
			if (true) {
				this.db.getYoutubeSubscribers(this.model.user.uid).then((subscribers) => {
					var subscriberMap = new Map();
					console.log("this is the subs", subscribers)
					Object.keys(subscribers).forEach((subscriber) => {
						subscriberMap.set(subscriber, 1);
					});

					var p = new Promise((resolve, reject) => {
						console.log("In Youtube Promise")
						this.filteredUsers.forEach((user) => {
							this.youtubeCommon = 0;
							this.holder = this.commonMap.get(user.uid);
							(this.commonMap.get(user.uid)).YT = "Youtube";

							this.db.getYoutubeSubscribers(user.uid).then((nearbySubscriber) => {
								var match = false;
								console.log("Current User Info: " + nearbySubscriber)
								if(nearbySubscriber != null){
									Object.keys(nearbySubscriber).forEach((subscriber) => {

										//console.log(subscriber)
										//console.log(subscriberMap);
										if (subscriberMap.get(subscriber)) {
											match = true;
											//console.log("hellllllllllooooooooooo")
											this.youtubeCommon = this.youtubeCommon + 1;
											(this.commonMap.get(user.uid)).youtube = true;
											(this.commonMap.get(user.uid)).YT = "Youtube";
										}
									});
								}
								
								(this.commonMap.get(user.uid)).youtubeNum = this.youtubeCommon;

								if (match) {
									filterUsersArray.push(user);
								}
								resolve(filterUsersArray);
							}).catch((err) => {
								console.log(err);
								reject(err);
							});
						});
					}).then((users: any) => {
						if (!num) {
							this.filteredUsers = filterUsersArray;
							console.log("Filtered Users:", filterUsersArray);
						}
						else {
							console.log("Youtube Filtering Done")
							
						}
						mainResolve("Youtube")
					}).catch((err) => {
						console.error(err);
					});
				}).catch((err) => {
					console.error(err);
				});
			}
		});
	}

	filterUsersBasedOnBlackboard(num: number) {

		return new Promise((mainResolve, mainReject) => {
			//console.log("Blackboard");
			var filterUsersArray = [];
			this.db.getClasses(this.model.user.uid).then((classes) => {
				var classesMap = new Map();

				classes.forEach((singleClass) => {
					classesMap.set(singleClass, 1);
				});

				var p = new Promise((resolve, reject) => {
					this.filteredUsers.forEach((user) => {
						this.blackboardCommon = 0;
						(this.commonMap.get(user.uid)).blackboardNum = 0;

						this.db.getClasses(user.uid).then((nearbyUser) => {
							var match = false;
							

							if (nearbyUser != null) {
								nearbyUser.forEach((singleClass) => {
									if (classesMap.get(singleClass)) {
										match = true;
										this.blackboardCommon = this.blackboardCommon + 1;
										(this.commonMap.get(user.uid)).blackboard = true;
										(this.commonMap.get(user.uid)).BB = "Blackboard";
									}
								});

							}
							if (match) {
								(this.commonMap.get(user.uid)).blackboardNum = this.blackboardCommon;
								filterUsersArray.push(user);
							}
							resolve(filterUsersArray);
						}).catch((err) => {
							console.log(err);
							reject(err);
						});
					});
				}).then((users: any) => {
					if (!num) {
						this.filteredUsers = filterUsersArray;
						console.log("Filtered Users:", filterUsersArray);
					}
					else {
						//console.log("Blackboard Filtering Done")
					}
					mainResolve("Blackboard")
				}).catch((err) => {
					console.error(err);
				});
			}).catch((err) => {
				console.log(err);

			})
		});
	}

	sendBroadcast() {
		var location = {
			latitude: this.lat,
			longitude: this.lng
		};
		console.log("date:", (new Date).getTime());
		console.log("Hours:", (new Date))
		console.log(this.specificInterest);
		this.db.storeBroadcast(this.model.user.uid, location, this.broadcastText, (new Date).getTime(), this.specificInterest).then((data) => {
			console.log("broadcast sent");
		}).catch((err) => {
			console.error(err);
		})
		console.log(this.broadcastText);
	}

	viewBroadcast(broadcastToView) {
		console.log("viewing");

		this.selectedBroadcast = broadcastToView;
		this.broadcastResponses = broadcastToView.responses;
		/*code to display proper messages*/
	}

	respondToBroadcast() {
		console.log("Here");
		if (this.selectedBroadcast) {
			this.db.respondToBroadcast(this.model.user.uid, this.selectedBroadcast.broadcastID, this.responseText, (new Date).getTime());
		}
	}

	filterBroadcasts(){

		this.filteredBroadcasts = [];
		if(this.filterInterest == ""){
			this.filteredBroadcasts = this.broadcasts;
		}
		this.broadcasts.forEach((cast) => {
			console.log("filter: ", this.filterInterest);
			if(this.filterInterest == cast.subject){
				this.filteredBroadcasts.push(cast);
			}
		})

	}

	generateCommonMap() {
		console.log("i got called");
		this.auth.getUser().then((u) => {
			this.db.getNearbyUsers(u.uid).then((nearbyUsers) => {
				//console.log("Nearby:", nearbyUsers);
				this.nearbyUsers = nearbyUsers;
				this.CommonUsersList = this.nearbyUsers;
				
				nearbyUsers.forEach((nearbyUser) => {

					// this.facebookCommon = 0;
					// this.twitterCommon = 0;
					// this.blackboardCommon = 0;
					// this.youtubeCommon = 0;
					this.temp = new Commonalities();
					this.temp.uid = nearbyUser.uid;
					this.temp.facebook = false;
					this.temp.facebookNum = 0;
					this.temp.twitter = false;
					this.temp.twitterNum = 0;
					this.temp.blackboard = false;
					this.temp.blackboardNum = 0;
					this.temp.youtube = false;
					this.temp.youtubeNum = 0;
					this.temp.FB = "Facebook";
					this.temp.TW = "Twitter";
					this.temp.BB = "BlackBoard";
					this.temp.YT = "Youtube";
					this.temp.interestSub = new Map();
					this.commonMap.set(nearbyUser.uid, this.temp);
				});
				this.getCommon();

			}).catch((err) => {
				console.error(err);
			})
		})
		//this.getCommon();		
	}
	getCommon() {
		console.log("getCommon Called")
		this.facebookCommon = 0;
		this.twitterCommon = 0;
		this.blackboardCommon = 0;
		this.youtubeCommon = 0;

		var promises = [];
		promises.push(this.filterUsersBasedOnFacebook(1));
		promises.push(this.filterUsersBasedOnTwitter(1));
		// promises.push(this.filterUsersBasedOnYoutube(1));
		promises.push(this.filterUsersBasedOnBlackboard(1));

		//console.log();

		this.db.getInterests(this.model.user.uid).then((interests) => {
				this.interestObject = interests;
				this.interestKeys = Object.keys(this.interestObject);
				//console.log(this.interestKeys)
				this.interestKeys.forEach((gg) => {
				promises.push(this.filterUsersBasedOnInterests(gg, 1));
				});
				
			}).catch((err) => {
				console.log(err);
			})






		Promise.all(promises).then(() =>{
			console.log("common", this.commonMap.get("ZVmOhUAURNOD8t4zqunUdUtjc4B3"));
			console.log("Promises: " + promises)
			this.generateTiers();
		})
	}

	generateTiers(){
		console.log("generateTiers Called")
		var allTotals = [];
		var tempTotal = 0;
		
		this.commonMap.forEach((user) =>{
			tempTotal = 0;
			//console.log(user);

				var flag = true;
				do{
					tempTotal += (user.facebookNum * 0.1);
					// console.log("User got in facebook " + tempTotal)

					tempTotal += (user.twitterNum * 0.1);
					// console.log("User got in twitter " + tempTotal)

					tempTotal += (user.youtubeNum * 0.1);
					// console.log("User got in youtube " + tempTotal)

					tempTotal += user.blackboardNum;
					// console.log("User got in blackboard " + tempTotal)

					var intCatNum = user.interestSub.size;
					var intSubNum = 0;
					user.interestSub.forEach((interest) =>{
						intSubNum += interest.value;
					});
					tempTotal += (intCatNum + intSubNum);

					allTotals.push(tempTotal);
					flag = false;
				}while(flag)
			
		});
		console.log(allTotals);
	}

}