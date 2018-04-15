import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';
import { interestsList } from '../services/interests.service';
import { Commonalities } from '../services/commonalities';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	lat: number = this.lat;
	lng: number = this.lng;

	editMood = false;
	editRange = false;

	nearbyUsers = [];
	filteredUsers = [];
	displayedUser: any = {};

	interestObject: any = {};
	interestKeys = [];

	currentFilter = "";
	currentFilterArray = [];

	selectedBroadcast: any = {};
	broadcastText = "";
	responseText = "";
	broadcasts = [];
	filteredBroadcasts = [];
	broadcastResponses = [];
	viewBroadcasts = false;
	newBroadcast = false;
	filterBroadcast = false;

	viewMessages = false;

	locationFound = false;
	testArray = [1, 2, 3, 4, 5, 6]

	facebookCommon: number = 0;
	twitterCommon: number = 0;
	blackboardCommon: number = 0;
	youtubeCommon: number = 0;
	interestCommon: number = 0;

	specificInterest = "";
	filterInterest = "";

	broadcastCategory = "";
	broadInterests = [];
	broadClasses = [];

	commonMap = new Map();
	CommonUsersList = [];
	CommonUsersListtemp = [];

	temp;
	holder;

	tier1 = [];
	tier2 = [];
	tier3 = [];

	refreshList() {
		var ph;
		this.auth.getUser().then((u) => {
			this.db.getNearbyUsers(u.uid, 20 - this.currentZoom).then((nearbyUsers) => {
				console.log("Nearby:", nearbyUsers);
				this.nearbyUsers = nearbyUsers;
				// this.filteredUsers = nearbyUsers; //copy of users for filtering ONLY

				this.nearbyUsers.forEach((user) => {
					user.distanceInMiles = Math.round((user.distance / 5280) * 100) / 100;
				})
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
			this.broadClasses = classes;
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

	updateBroadInterests() {
		if (this.broadcastCategory != 'blackboard') {
			this.broadInterests = Object.values(this.interestObject[this.broadcastCategory]);
		}
		else {
			this.broadInterests = this.broadClasses;
		}

		//console.log("UpdateBroadInterests")
	}

	refreshBroadcasts(selectedBroadcast){
		this.db.getNearbyBroadcasts(this.model.user.uid.toString()).then((broadcasts) => {
			this.broadcasts = broadcasts;
			this.filteredBroadcasts = broadcasts;
			if(!!selectedBroadcast){
				broadcasts.forEach((broad) => {
					if(broad.broadcastID == selectedBroadcast.broadcastID){
						this.selectedBroadcast = broad;
						this.broadcastResponses = broad.responses;
					}
				});
			}
			
			console.log(broadcasts);
		});
	}

	userVisible = false;

	viewUser(user: any = {}) {
		this.userVisible = true;
		this.displayedUser = user;
		this.displayedUser.distanceInMiles = Math.round((this.displayedUser.distance / 5280) * 100) / 100;
		if (isNaN(this.displayedUser.distanceInMiles))
			this.displayedUser.distanceInMiles = 0;
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


	model = {
		user: new User(),
		moodStatus: "",

	}
	errors = {
		mood: ""
	}

	moodChange() {
		console.log(this.model);
		this.model.user.moodStatus = this.model.moodStatus;
		localStorage.setItem("localMood", this.model.user.moodStatus);

		this.auth.getUser().then((user) => {
			//this.model.user.uid = user.uid;
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);
				// console.log(user.data.moodStatus);
				
				this.errors.mood = "Your mood status has been updated!"
				//this.router.navigateByUrl('map');
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

	//Invisibility Toggle 0=Invisible, 4hour, 12hour, 24hour, 100=Visible
	visibility;
	// visibility = this.model.user.visability;

	setVisible(number) {
		this.visibility = number;
		this.model.user.visibility = (number == 100);
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
			//this.success.changeInfoS = "Your information has been updated!"
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
			console.log("INTEREST FILTER: " + this.currentFilter)
			this.model.user.filteredInterests.push(this.currentFilter);
			this.filterUsersBasedOnInterests(this.currentFilter, 0);
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
		this.filteredUsers = this.nearbyUsers;
		this.currentFilterArray = [];
		var promises = [];
		var count = 0;

		if (this.model.user.filterFacebook) {
			this.currentFilterArray.push("Facebook");
			promises.push(this.filterUsersBasedOnFacebook(0));
			count++;
		}
		if (this.model.user.filterTwitter) {
			this.currentFilterArray.push("Twitter")
			promises.push(this.filterUsersBasedOnTwitter(0));
			count++;
		}
		if (this.model.user.filterYoutube) {
			this.currentFilterArray.push("Youtube")
			promises.push(this.filterUsersBasedOnYoutube(0));
			count++;
		}
		if (this.model.user.filterBlackBoard) {
			this.currentFilterArray.push("Blackboard")
			promises.push(this.filterUsersBasedOnBlackboard(0));
			count++;
		}

		if (<number>this.model.user.filteredInterests.length != 0) {
			for (var i = 0; i < this.model.user.filteredInterests.length; i++) {
				if (this.model.user.filteredInterests[i] != "") {
					this.currentFilterArray.push(this.model.user.filteredInterests[i]);
					this.filterUsersBasedOnInterests(this.model.user.filteredInterests[i], 0);
					count++;
				}
			}
		}

		Promise.all(promises).then(() => {
			if (count == 0) {
				this.filteredUsers = this.nearbyUsers;
			}
			console.log("Filters Maintained: " + count)
			this.generateCommonMap();
		})
	}


	particlesConfig;
	submitted = false;


	localStorage(){
		localStorage.setItem("localVisibility", String(this.model.user.visibility));
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
		        console.log(userData)
		     })

	    });

	    this.auth.getUser().then((user) => {

	   		if(localStorage.getItem("localVisibility") == null || localStorage.getItem("localMood") == null){ //only call Database if necessary
	   			this.db.getUser(user.uid).then((userData) => {
	   			console.log("localStorage Missing");
		        this.model.user = userData;
		        console.log(userData)
		        this.visibility = this.model.user.visibility;
		        this.model.moodStatus = userData.moodStatus;
		        this.localStorage();
		      })
	   		}
	    });



		loc.getLocation().then((l) => {
			var ph;
			auth.getUser().then((u) => {
				db.storeLocation(l, u.uid).then((d) => {
					console.log(d);

					this.db.getNearbyBroadcasts(u.uid).then((broadcasts) => {
						this.broadcasts = broadcasts;
						this.filteredBroadcasts = broadcasts;
						console.log(broadcasts);
					});


					db.getNearbyUsers(u.uid, 20 - this.currentZoom).then((nearbyUsers) => {
						console.log("Nearby:", nearbyUsers);
						this.nearbyUsers = nearbyUsers;
						// this.filteredUsers = nearbyUsers; //copy of users for filtering ONLY

						this.nearbyUsers.forEach((user) => {
							user.distanceInMiles = Math.round((user.distance / 5280) * 100) / 100;
						})


						this.maintainFilter();

					}).catch((err) => {
						console.error(err);
					})

				}).catch((e) => {
					console.error(e);
				})
			})
		})
	}

	ngOnInit() {
	}

	filterUsersBasedOnInterests(interest, num: number) {
		return new Promise((mainResolve, mainReject) => {
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
					if(this.filteredUsers.length != 0){
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
								else { //if null, empty out the list
									userInterests = [];
								}
								this.interestCommon = 0;
								for (var i = 0; i < modelInterests.length; i++) {
									for (var j = 0; j < userInterests.length; j++) {
										if (modelInterests[i] == userInterests[j]) {
											match = true;
											this.interestCommon = this.interestCommon + 1;
											//console.log("they are the same" , userInterests[j])
											//break;
										}
									}
								}
		
								//console.log(interest, " ", this.interestCommon)
								if (match) {
									// console.log("Got a match")
									filterUsersArray.push(user);
									(this.commonMap.get(user.uid)).interestSub.set(interest, this.interestCommon)
								}
								resolve(filterUsersArray);
							}).catch((err) => {
								console.log(err);
								reject(err);
							});
						});
					}
					else{
						console.log("Apparently filteredUsers is empty")
						resolve(filterUsersArray); //if list is empty
					}
				}).then((users: any) => {
					if (!num) {
						this.filteredUsers = filterUsersArray;
						console.log("Filtered Users:", filterUsersArray);
						this.generateCommonMap();
					}
					else {
						console.log("Interest Filtering Done")
					}
					mainResolve("Interests")
				});
			}
		});
	}

	filterUsersBasedOnFacebook(num: number){
		return new Promise((mainResolve, mainReject) => {
			var filterUsersArray = [];
			if (true /*check facebook thing*/) {

				this.db.getFacebookFriends(this.model.user.uid).then((friends) => {
					var friendMap = new Map();

					friends.forEach((friend) => {
						friendMap.set(friend, 1);

					});
					var p = new Promise((resolve, reject) => {
						if(this.filteredUsers.length != 0){
							this.filteredUsers.forEach((user) => {
								//reset all commonality values
								this.facebookCommon = 0;
								if(num){
									(this.commonMap.get(user.uid)).FB = "Facebook";
									(this.commonMap.get(user.uid)).facebookNum = 0;
								}
	
								this.db.getFacebookFriends(user.uid).then((nearbyFriend) => {
									var match = false;
	
									nearbyFriend.forEach((friend) => {
										if (friendMap.get(friend)) {
											match = true;
											this.facebookCommon = this.facebookCommon + 1;
											
											if(num){
												(this.commonMap.get(user.uid)).facebook = true;
												(this.commonMap.get(user.uid)).FB = "Facebook";
											}
										}
									});
	
									if (match) {
										filterUsersArray.push(user);
	
										if(num){
											(this.commonMap.get(user.uid)).facebookNum = this.facebookCommon;
										}
									}
									resolve(filterUsersArray);
	
								}).catch((err) => {
									console.log(err);
									reject(err);
								});
							});
						}
						else{
							console.log("Apparently filteredUsers is empty")
							resolve(filterUsersArray); //if list is empty
						}
					}).then((users: any) => {
						if (!num) {
							this.filteredUsers = filterUsersArray;
							console.log("Filtered Users Facebook:", filterUsersArray);
							this.generateCommonMap();
						}
						else {
							console.log("Facebook Filtering Done")
						}
						mainResolve("Facebook")
					});
				}).catch((err) => {
					console.error(err);
					mainResolve("Facebook")
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
						if(this.filteredUsers.length != 0){
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
						}
						else{
							console.log("Apparently filteredUsers is empty")
							resolve(filterUsersArray); //if list is empty
						}
					}).then((users: any) => {
						if (!num) {
							this.filteredUsers = filterUsersArray;
							console.log("Filtered Users:", filterUsersArray);
							this.generateCommonMap();
						}
						else {
							console.log("Twitter Filtering Done")
						}
						mainResolve("Twitter")
					});
				}).catch((err) => {
					console.error(err);
					mainResolve("Twitter")
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
						if(this.filteredUsers.length != 0){
							this.filteredUsers.forEach((user) => {
								this.youtubeCommon = 0;
								// this.holder = this.commonMap.get(user.uid);
								if(num){
									(this.commonMap.get(user.uid)).YT = "Youtube";
								}
								
	
								this.db.getYoutubeSubscribers(user.uid).then((nearbySubscriber) => {
									var match = false;
									// console.log("Current User Info: " + nearbySubscriber)
									if (nearbySubscriber != null) {
										Object.keys(nearbySubscriber).forEach((subscriber) => {
	
											//console.log(subscriber)
											//console.log(subscriberMap);
											if (subscriberMap.get(subscriber)) {
												match = true;
												//console.log("hellllllllllooooooooooo")
												this.youtubeCommon = this.youtubeCommon + 1;
												if(num){
													(this.commonMap.get(user.uid)).youtube = true;
													(this.commonMap.get(user.uid)).YT = "Youtube";
												}
												
											}
										});
									}
									if(num){
										(this.commonMap.get(user.uid)).youtubeNum = this.youtubeCommon;
										this.youtubeCommon = 0;
									}
	
									if (match) {
										filterUsersArray.push(user);
									}
									resolve(filterUsersArray);
								}).catch((err) => {
									console.log(err);
									//reject(err);
									resolve(filterUsersArray);
								});
							});
						}
						else{
							console.log("Apparently filteredUsers is empty")
							resolve(filterUsersArray); //if list is empty
						}
					}).then((users: any) => {
						if (!num) {
							this.filteredUsers = filterUsersArray;
							console.log("Filtered Users:", filterUsersArray);
							this.generateCommonMap();
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
					mainResolve("Youtube")
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
					if(this.filteredUsers.length != 0){
						this.filteredUsers.forEach((user) => {
							this.blackboardCommon = 0;
							if(num){
								(this.commonMap.get(user.uid)).blackboardNum = 0;
							}
							
	
							this.db.getClasses(user.uid).then((nearbyUser) => {
								var match = false;
	
	
								if (nearbyUser != null) {
									nearbyUser.forEach((singleClass) => {
										if (classesMap.get(singleClass)) {
											match = true;
	
											if(num){
												this.blackboardCommon = this.blackboardCommon + 1;
												(this.commonMap.get(user.uid)).blackboard = true;
												(this.commonMap.get(user.uid)).BB = "Blackboard";
											}
										}
									});
	
								}
								if (match) {
									filterUsersArray.push(user);
									if(num){
										(this.commonMap.get(user.uid)).blackboardNum = this.blackboardCommon;
									}
								}
								resolve(filterUsersArray);
							}).catch((err) => {
								console.log(err);
								reject(err);
							});
						});
					}
					else{
						console.log("Apparently filteredUsers is empty")
						resolve(filterUsersArray); //if list is empty
					}
				}).then((users: any) => {
					if (!num) {
						this.filteredUsers = filterUsersArray;
						console.log("Filtered Users:", filterUsersArray);
						this.generateCommonMap();
					}
					else {
						console.log("Blackboard Filtering Done")
					}
					mainResolve("Blackboard")
				}).catch((err) => {
					console.error(err);
				});
			}).catch((err) => {
				console.log(err);
				mainResolve("Blackboard")

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
			this.broadcastText = "";
			console.log("broadcast sent");
			this.refreshBroadcasts(this.selectedBroadcast);
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
			this.db.respondToBroadcast(this.model.user.uid, this.selectedBroadcast.broadcastID, this.responseText, (new Date).getTime()).then(() => {
				this.responseText = "";
				var p = new Promise((good, bad) => {
					this.refreshBroadcasts(this.selectedBroadcast);
					good();	
				}).then(() => {

				})
				
				
			});
		}
	}

	filterBroadcasts() {

		this.filteredBroadcasts = [];
		if (this.filterInterest == "") {
			this.filteredBroadcasts = this.broadcasts;
		}
		this.broadcasts.forEach((cast) => {
			console.log("filter: ", this.filterInterest);
			if (this.filterInterest == cast.subject) {
				this.filteredBroadcasts.push(cast);
			}
		})

	}

	generateCommonMap() {
		console.log("i got called");
		this.auth.getUser().then((u) => {
			this.db.getNearbyUsers(u.uid, 20 - this.currentZoom).then((nearbyUsers) => {
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
		var interestPromises = [];
		this.db.getInterests(this.model.user.uid).then((interests) => {
			if(interests != null){
				this.interestObject = interests;
				this.interestKeys = Object.keys(this.interestObject);
				//console.log(this.interestKeys)
				this.interestKeys.forEach((gg) => {
					// promises.push(this.filterUsersBasedOnInterests(gg, 1));
					interestPromises.push(this.filterUsersBasedOnInterests(gg, 1));
				});
				promises.push(interestPromises);
			}
		}).catch((err) => {
			console.log(err);
		})

		promises.push(this.filterUsersBasedOnYoutube(1));
		promises.push(this.filterUsersBasedOnBlackboard(1));
		promises.push(this.filterUsersBasedOnFacebook(1));
		promises.push(this.filterUsersBasedOnTwitter(1));

		//console.log();



		Promise.all(promises).then(() => {
			console.log("common", this.commonMap);
			
			console.dir(this.commonMap)
			this.generateTiers();
		})
	}

	generateTiers(){
		this.tier1 = [];
		this.tier2 = [];
		this.tier3 = [];
		console.log("generateTiers Called")
		var allTotals = {};
		var allUsers = {};
		var tempTotal = 0;
		var minValue;
		var minUid = "";
		var maxValue;
		var maxUid = "";

		this.filteredUsers.forEach((userF) => {
			var user = this.commonMap.get(userF.uid);
			tempTotal = 0;
			// console.log(user);

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
			user.interestSub.forEach((interest) => {
				intSubNum += interest;
			});
			tempTotal += (intCatNum + intSubNum);

			// allTotals.push(tempTotal);
			if(minValue == null || tempTotal < minValue){
				minValue = tempTotal;
				minUid = userF.uid;
			}
			else if(maxValue == null || tempTotal > maxValue){
				maxValue = tempTotal;
				maxUid = userF.uid;
			}
			// allTotals.set(userF.uid, tempTotal);
			allTotals[userF.uid] = tempTotal;
			allUsers[userF.uid] = userF;

		});
		var cutoff = ((maxValue - minValue) / 3).toFixed(1);
		var cutoff2 = (((maxValue - minValue) / 3) * 2).toFixed(1);
		// console.log("Cutoffs: " + cutoff + " " + cutoff2);
		// console.log(allTotals);
		var tempTier1 = [];
		var tempTier2 = [];
		var tempTier3 = [];
		Object.keys(allTotals).forEach((total) =>{
			if(allTotals[total] <= cutoff){
				this.tier3.push(allUsers[total])
			}
			else if(allTotals[total]  <= cutoff2){
				this.tier2.push(allUsers[total])
			}
			else{
				this.tier1.push(allUsers[total])
			}
		})
		// console.log(allTotals);
		console.log("TIER 3: " + this.tier3);
		console.log("TIER 2: " + this.tier2);
		console.log("TIER 1: " + this.tier1);
	}

}

