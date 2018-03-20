import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	lat: number = this.lat;
	lng: number = this.lng;

	editMood = false;
	editRange = false;

	nearbyUsers = [];
	displayedUser: any={};

	toggleMood(){
		this.editMood = !this.editMood;
	}

	toggleRange(){
		this.editRange = !this.editRange;
	}

	model = {
		user: new User(),
		moodStatus: ""
	}
	errors = {
		mood: ""
	}

	MoodStatus = "Mood Status";

	moodChange(){
		console.log(this.model);
		this.model.user.moodStatus = this.model.moodStatus;
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);
				this.errors.mood = "Your mood status has been updated!"
			}).catch((err)=>{
				console.error(err);
				this.errors.mood = "Your mood status has NOT been updated!"

				//Form rejected for some reason
			})
		});


	}

	//ZOOM VALUE FOR MAP
	zoom: number = 15;
	currentZoom: number = 15;

	zoomMap(){
		this.zoom = this.currentZoom;
		
	}

	userVisible = false;

	viewUser(user: any={}){
		this.userVisible = true;
		this.displayedUser = user;
		this.displayedUser.distanceInMiles = Math.round((this.displayedUser.distance/5280)*100)/100;
		if(isNaN(this.displayedUser.distanceInMiles))
			this.displayedUser.distanceInMiles = 0;
	}

	closeUser(){
		this.userVisible = false;
  }
  
  filterVisible = false;

  viewFilter(){
    this.filterVisible = true;
  }

  closeFilter(){
    this.filterVisible = false;
  }

  toggleFilter(){
    this.filterVisible = !this.filterVisible;
    console.log("hit");
  }

  nearbyPin = ("../../assets/NearbyPin.png");
  userPin = ("../../assets/UserPin.png");

  //Invisibility Toggle 0=Invisible, 4hour, 12hour, 24hour, 100=Visible
	visibility = 0;
  // visibility = this.model.user.visability;
  
  setVisible(number){
    this.visibility = number;
      //this.model.user.visability = number;
    }


	particlesConfig;
	submitted = false;


	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService, public loc: LocationService ) {

		loc.getLocation().then((l)=> {
			auth.getUser().then((u) => {
				db.storeLocation(l, u.uid).then((d) =>{
					this.lat = l.latitude;
					this.lng = l.longitude;
					

					db.getNearbyUsers(u.uid).then((nearbyUsers) => {
						console.log("Nearby:",nearbyUsers);
						this.nearbyUsers = nearbyUsers;
					}).catch((err) => {
						console.error(err);
					})
				}).catch((e) =>{
					console.error(e);
				})
			})
		})


		this.auth.isAuthed().then((user) => {
			console.log("Authed:",user)
			this.model.user.uid = user.uid;
			
		});  

		this.auth.getUser().then((user) => {
			this.model.user.uid = user.uid;
			this.db.getUser(user.uid).then((userData) => {
				this.model.moodStatus = userData.moodStatus;

				this.model.user = userData;
				console.log(userData)
			})
		}); 
		
		



	}

	ngOnInit() {
	}

	filterUsersBasedOnFacebook(){
		var filterUsers = [];
		if(true /*check facebook thing*/){

			this.db.getFacebookFriends(this.model.user.uid).then((friends) => {
				var friendMap = new Map();

				friends.forEach((friend) => {
//					console.log(friend);
					friendMap.set(friend, 1);
				});
				var p = new Promise((resolve, reject) => {


					this.nearbyUsers.forEach((user) => {
						this.db.getFacebookFriends(user.uid).then((nearbyFriend) => {
							var match = false;
							nearbyFriend.forEach((friend) => {
								//console.log(friend);
								if(friendMap.get(friend)){
									match = true;
								}
							});
							
							if(match){
								
								filterUsers.push(user);
							}	


/*						for(  in nearbyFriend){
							console.log(friend.id);
							if(friendMap.get(friend.id)){
								match = true;
								break;
							}
						}*/

									

						resolve(filterUsers);
					}).catch((err) => {
						console.log(err);
						reject(err);
					});

					});
				}).then((users: any) => {
					this.nearbyUsers = filterUsers;
					console.log("Filtered Users:", filterUsers);
				});
				
				//this.nearbyUsers = filterUsers;

			}).catch((err) => {
				console.error(err);
			});

		}

	}
}