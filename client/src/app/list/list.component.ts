import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';
import { interestsList } from '../services/interests.service';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

	editMood = false;
	editRange = false;

	nearbyUsers = [];
	filteredUsers = [];
	displayedUser: any = {};

	interestObject: any = {};
	interestKeys = [];

	currentFilter = "";
	currentFilterArray = [];

	refreshList() {
		var ph;
		this.auth.getUser().then((u) => {
			this.db.getNearbyUsers(u.uid).then((nearbyUsers) => {
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

	closeFilter() {
		this.filterVisible = false;
	}

	toggleFilter() {
		this.filterVisible = true;
		if (this.filterVisible) {
			this.db.getInterests(this.model.user.uid).then((interests) => {
				this.interestObject = interests;
				this.interestKeys = Object.keys(this.interestObject);
				console.log(this.interestKeys)
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

        console.log("Filter Added: " + this.currentFilter);
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
			this.filterUsersBasedOnInterests(this.currentFilter);
        }
    }

	removeFilter(filter) {
        console.log("Filter Removed: " + filter);
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

	interestsFilter(interest) {
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);

				if (this.model.user.filterInterests) {
					this.filterUsersBasedOnInterests(interest);
				}
				else {
					this.maintainFilter();
				}

			}).catch((err) => {
				console.error(err);

			})
		});
	}

	facebookFilter() {
		var ph;
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);

				if (this.model.user.filterFacebook) {
					this.filterUsersBasedOnFacebook();
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
		var ph;
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);

				if (this.model.user.filterTwitter) {
					this.filterUsersBasedOnTwitter();
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
				console.log(data);

				if (this.model.user.filterYoutube) {
					this.filterUsersBasedOnYoutube();
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
		var ph;
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);

				if (this.model.user.filterBlackBoard) {
					this.filterUsersBasedOnBlackboard();
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
        var count = 0;

        if (this.model.user.filterFacebook) {
            this.currentFilterArray.push("Facebook");
            this.filterUsersBasedOnFacebook();
            count++;
        }
        if (this.model.user.filterTwitter) {
            this.currentFilterArray.push("Twitter")
            this.filterUsersBasedOnTwitter();
            count++;
        }
        if (this.model.user.filterYoutube) {
			this.currentFilterArray.push("Youtube")
			this.filterUsersBasedOnYoutube();
            count++;
        }
        if (this.model.user.filterBlackBoard) {
            this.currentFilterArray.push("Blackboard")
            this.filterUsersBasedOnBlackboard();
            count++;
        }

        if (this.model.user.filteredInterests.length != 0) {
            for (var i = 0; i < this.model.user.filteredInterests.length; i++) {
                if(this.model.user.filteredInterests[i] != ""){
                    this.currentFilterArray.push(this.model.user.filteredInterests[i]);
                    this.filterUsersBasedOnInterests(this.model.user.filteredInterests[i]);
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

					db.getNearbyUsers(u.uid).then((nearbyUsers) => {
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

	filterUsersBasedOnInterests(interest) {
		var filterUsersArray = [];
		var modelInterests = [];
		var userInterests = [];

		if (true) {
			var p = new Promise((resolve, reject) => {
				this.db.getInterests(this.model.user.uid).then((mi) => {
					/*if(typeof mi !== 'undefined'){*/
					if (Object.keys(mi).indexOf(interest) != -1) {

						modelInterests = Object.values(mi[interest]);
						// console.log("MI: " +modelInterests;
					}
				})
				console.log(modelInterests);
				this.filteredUsers.forEach((user) => {
					var match = false;

					this.db.getInterests(user.uid).then((ui) => {
						if (ui != null) {
							if (Object.keys(ui).indexOf(interest) != -1) {

								userInterests = Object.values(ui[interest]);
								// console.log("UI: " +userInterests);
							}
						}
						else{ //if null, empty out the list
							userInterests = [];
						}
						for (var i = 0; i < modelInterests.length; i++) {
							for (var j = 0; j < userInterests.length; j++) {
								// console.log(modelInterests[i] + " + " + userInterests[j]);
								if (modelInterests[i] == userInterests[j]) {
									match = true;
									break;
								}
							}
						}
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
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnFacebook() {
		var filterUsersArray = [];
		if (true /*check facebook thing*/) {

			this.db.getFacebookFriends(this.model.user.uid).then((friends) => {
				var friendMap = new Map();

				friends.forEach((friend) => {
					friendMap.set(friend, 1);
				});
				var p = new Promise((resolve, reject) => {
					this.filteredUsers.forEach((user) => {
						this.db.getFacebookFriends(user.uid).then((nearbyFriend) => {
							var match = false;
							nearbyFriend.forEach((friend) => {
								//console.log(friend);
								if (friendMap.get(friend)) {
									match = true;
								}
							});

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
					this.filteredUsers = filterUsersArray;
					console.log("Filtered Users:", filterUsersArray);
				});
			}).catch((err) => {
				console.error(err);
			});

		}

	}

	filterUsersBasedOnTwitter() {
		var filterUsersArray = [];
		if (true) {
			this.db.getTwitterFollowees(this.model.user.uid).then((followees) => {
				var followeeMap = new Map();

				followees.forEach((followee) => {
					followeeMap.set(followee, 1);
				});
				var p = new Promise((resolve, reject) => {
					this.filteredUsers.forEach((user) => {
						this.db.getTwitterFollowees(user.uid).then((nearbyFollowee) => {
							var match = false;

							nearbyFollowee.forEach((followee) => {
								if (followeeMap.get(followee)) {

									match = true;
								}
							});
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
					this.filteredUsers = filterUsersArray;
					console.log("Filtered Users:", filterUsersArray);
				});
			}).catch((err) => {
				console.error(err);
			});

		}

	}

	filterUsersBasedOnYoutube() {

		var filterUsersArray = [];
		if (true) {
			this.db.getYoutubeSubscribers(this.model.user.uid).then((subscribers) => {
				var subscriberMap = new Map();

				Object.values(subscribers).forEach((subscriber) => {
					subscriberMap.set(subscriber, 1);
				});
				var p = new Promise((resolve, reject) => {
					this.filteredUsers.forEach((user) => {
						this.db.getTwitterFollowees(user.uid).then((nearbySubscriber) => {
							var match = false;
							nearbySubscriber.forEach((subscriber) => {
								if (subscriberMap.get(subscriber)) {
									match = true;
								}
							});
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
					this.filteredUsers = filterUsersArray;
					console.log("Filtered Users:", filterUsersArray);
				});
			}).catch((err) => {
				console.error(err);
			});

		}

	}

	filterUsersBasedOnBlackboard() {
		console.log("Blackboard");
		var filterUsersArray = [];
		this.db.getClasses(this.model.user.uid).then((classes) => {
			var classesMap = new Map();

			classes.forEach((singleClass) => {
				classesMap.set(singleClass, 1);
			});

			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					this.db.getClasses(user.uid).then((nearbyUser) => {
						var match = false;
						if (nearbyUser != null) {
							nearbyUser.forEach((singleClass) => {
								if (classesMap.get(singleClass)) {
									match = true;
								}
							});
						}
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
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}).catch((err) => {
			console.log(err);
		})
	}

}

