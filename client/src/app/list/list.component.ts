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
				this.maintainFilter(ph);

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
		this.filterVisible = !this.filterVisible;
		console.log("hit");
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
		this.model.user.visibility = number;
		localStorage.setItem("localVisibility", number);

		this.auth.getUser().then((user) => {
			//this.model.user.uid = user.uid;
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);
				//this.success.changeInfoS = "Your information has been updated!"
				//this.router.navigateByUrl('map');
			}).catch((err) => {
				console.error(err);
				//this.errors.changeInfoE = "Your information has NOT been updated!"

				//Form rejected for some reason
			})
			//this.success.changeInfoS = "Your information has been updated!"
		});
	}

	interestsFilter(interest) {
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);

				if (this.model.user.filterInterests) {
					this.filterUsersBasedOnInterests(interest);
				}
				else {
					this.maintainFilter(interest);
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
					this.maintainFilter(ph);
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
					this.maintainFilter(ph);
				}

			}).catch((err) => {
				console.error(err);

			})

		});
	}
	linkedinFilter() {
		var ph;
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);

				if (this.model.user.filterLinkedIn) {

				}
				else {
					this.maintainFilter(ph);
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
					this.maintainFilter(ph);
				}

			}).catch((err) => {
				console.error(err);

			})

		});
	}

	maintainFilter(interest) {
		this.filteredUsers = this.nearbyUsers;
		var count = 0;
		if (this.model.user.filterInterests) {
			this.filterUsersBasedOnInterests(interest);
			count++;
		}
		if (this.model.user.filterFacebook) {
			this.filterUsersBasedOnFacebook();
			count++;
		}
		if (this.model.user.filterTwitter) {
			this.filterUsersBasedOnTwitter();
			count++;
		}
		if (this.model.user.filterLinkedIn) {

			count++;
		}
		if (this.model.user.filterBlackBoard) {
			this.filterUsersBasedOnBlackboard();
			count++;
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
						this.maintainFilter(ph);

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
						if(interest in mi){
							modelInterests = mi[interest];
						}
					/*}*/
				})
				this.filteredUsers.forEach((user) => {
					var match = false;
					
					this.db.getInterests(user.uid).then((ui) => {
						if(typeof ui !== 'undefined'){
							if(interest in ui){
								userInterests = ui[interest];
							}
						}
					})
					for(var i = 0; i < modelInterests.length; i++){
						for(var j = 0; j < userInterests.length; j++){
							if(modelInterests[i] == userInterests[j]){
								console.log(modelInterests[i]);
								console.log(userInterests[j]);
								console.log("hwiehfoawh;oaweij;gaw");
								match = true;
								break;
							}
						}
					}
					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
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

/*	filterUsersBasedOnAnimals() {
		var filterUsersArray = [];
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					this.db.getInterests(user.uid).forEach((interest) => {

					});

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnTV() {
		var filterUsersArray = [];
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					if (user.sports1 == true && this.model.user.sports1 == true) {
						match = true;
					}
					if (user.sports2 == true && this.model.user.sports2 == true) {
						match = true;
					}
					if (user.sports3 == true && this.model.user.sports3 == true) {
						match = true;
					}
					if (user.sporst4 == true && this.model.user.sports4 == true) {
						match = true;
					}
					if (user.sports5 == true && this.model.user.sports5 == true) {
						match = true;
					}
					if (user.sports6 == true && this.model.user.sports6 == true) {
						match = true;
					}
					if (user.sports7 == true && this.model.user.sports7 == true) {
						match = true;
					}
					if (user.sports8 == true && this.model.user.sports8 == true) {
						match = true;
					}
					if (user.sports9 == true && this.model.user.sports9 == true) {
						match = true;
					}
					if (user.sports10 == true && this.model.user.sports10 == true) {
						match = true;
					}

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnMovies() {
		var filterUsersArray = [];
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					if (user.sports1 == true && this.model.user.sports1 == true) {
						match = true;
					}
					if (user.sports2 == true && this.model.user.sports2 == true) {
						match = true;
					}
					if (user.sports3 == true && this.model.user.sports3 == true) {
						match = true;
					}
					if (user.sporst4 == true && this.model.user.sports4 == true) {
						match = true;
					}
					if (user.sports5 == true && this.model.user.sports5 == true) {
						match = true;
					}
					if (user.sports6 == true && this.model.user.sports6 == true) {
						match = true;
					}
					if (user.sports7 == true && this.model.user.sports7 == true) {
						match = true;
					}
					if (user.sports8 == true && this.model.user.sports8 == true) {
						match = true;
					}
					if (user.sports9 == true && this.model.user.sports9 == true) {
						match = true;
					}
					if (user.sports10 == true && this.model.user.sports10 == true) {
						match = true;
					}

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnHobbies() {
		var filterUsersArray = [];
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					if (user.sports1 == true && this.model.user.sports1 == true) {
						match = true;
					}
					if (user.sports2 == true && this.model.user.sports2 == true) {
						match = true;
					}
					if (user.sports3 == true && this.model.user.sports3 == true) {
						match = true;
					}
					if (user.sporst4 == true && this.model.user.sports4 == true) {
						match = true;
					}
					if (user.sports5 == true && this.model.user.sports5 == true) {
						match = true;
					}
					if (user.sports6 == true && this.model.user.sports6 == true) {
						match = true;
					}
					if (user.sports7 == true && this.model.user.sports7 == true) {
						match = true;
					}
					if (user.sports8 == true && this.model.user.sports8 == true) {
						match = true;
					}
					if (user.sports9 == true && this.model.user.sports9 == true) {
						match = true;
					}
					if (user.sports10 == true && this.model.user.sports10 == true) {
						match = true;
					}

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnCountry() {
		var filterUsersArray = [];
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					if (user.sports1 == true && this.model.user.sports1 == true) {
						match = true;
					}
					if (user.sports2 == true && this.model.user.sports2 == true) {
						match = true;
					}
					if (user.sports3 == true && this.model.user.sports3 == true) {
						match = true;
					}
					if (user.sporst4 == true && this.model.user.sports4 == true) {
						match = true;
					}
					if (user.sports5 == true && this.model.user.sports5 == true) {
						match = true;
					}
					if (user.sports6 == true && this.model.user.sports6 == true) {
						match = true;
					}
					if (user.sports7 == true && this.model.user.sports7 == true) {
						match = true;
					}
					if (user.sports8 == true && this.model.user.sports8 == true) {
						match = true;
					}
					if (user.sports9 == true && this.model.user.sports9 == true) {
						match = true;
					}
					if (user.sports10 == true && this.model.user.sports10 == true) {
						match = true;
					}

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnSports() {
		var filterUsersArray = [];
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					if (user.sports1 == true && this.model.user.sports1 == true) {
						match = true;
					}
					if (user.sports2 == true && this.model.user.sports2 == true) {
						match = true;
					}
					if (user.sports3 == true && this.model.user.sports3 == true) {
						match = true;
					}
					if (user.sporst4 == true && this.model.user.sports4 == true) {
						match = true;
					}
					if (user.sports5 == true && this.model.user.sports5 == true) {
						match = true;
					}
					if (user.sports6 == true && this.model.user.sports6 == true) {
						match = true;
					}
					if (user.sports7 == true && this.model.user.sports7 == true) {
						match = true;
					}
					if (user.sports8 == true && this.model.user.sports8 == true) {
						match = true;
					}
					if (user.sports9 == true && this.model.user.sports9 == true) {
						match = true;
					}
					if (user.sports10 == true && this.model.user.sports10 == true) {
						match = true;
					}

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnMusic() {
		var filterUsersArray = [];
		if (true ) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					if (user.music1 == true && this.model.user.music1 == true) {
						match = true;
					}
					if (user.music2 == true && this.model.user.music2 == true) {
						match = true;
					}
					if (user.music3 == true && this.model.user.music3 == true) {
						match = true;
					}
					if (user.music4 == true && this.model.user.music4 == true) {
						match = true;
					}
					if (user.music5 == true && this.model.user.music5 == true) {
						match = true;
					}
					if (user.music6 == true && this.model.user.music6 == true) {
						match = true;
					}
					if (user.music7 == true && this.model.user.music7 == true) {
						match = true;
					}
					if (user.music8 == true && this.model.user.music8 == true) {
						match = true;
					}
					if (user.music9 == true && this.model.user.music9 == true) {
						match = true;
					}
					if (user.music10 == true && this.model.user.music10 == true) {
						match = true;
					}

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}

	filterUsersBasedOnFood() {
		var filterUsersArray = [];
		if (true) {
			var p = new Promise((resolve, reject) => {
				this.filteredUsers.forEach((user) => {
					var match = false;
					if (user.food1 == true && this.model.user.food1 == true) {
						match = true;
					}
					if (user.food2 == true && this.model.user.food2 == true) {
						match = true;
					}
					if (user.food3 == true && this.model.user.food3 == true) {
						match = true;
					}
					if (user.food4 == true && this.model.user.food4 == true) {
						match = true;
					}
					if (user.food5 == true && this.model.user.food5 == true) {
						match = true;
					}
					if (user.food6 == true && this.model.user.food6 == true) {
						match = true;
					}
					if (user.food7 == true && this.model.user.food7 == true) {
						match = true;
					}
					if (user.food8 == true && this.model.user.food8 == true) {
						match = true;
					}
					if (user.food9 == true && this.model.user.food9 == true) {
						match = true;
					}
					if (user.food10 == true && this.model.user.food10 == true) {
						match = true;
					}

					if (match) {
						filterUsersArray.push(user);
					}
					resolve(filterUsersArray);
				})
			}).then((users: any) => {
				this.filteredUsers = filterUsersArray;
				console.log("Filtered Users:", filterUsersArray);
			});
		}
	}
*/
