import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

	editMood = false;
	editRange = false;

	nearbyUsers = [];
	displayedUser: any={};

	refreshMap(){
		this.auth.getUser().then((u) => {
			this.db.getNearbyUsers(u.uid).then((nearbyUsers) => {
				console.log("Nearby:",nearbyUsers);
				this.nearbyUsers = nearbyUsers;
				this.nearbyUsers.forEach((user) => {
					user.distanceInMiles = Math.round((user.distance/5280)*100)/100;
				})
			}).catch((err) => {
				console.error(err);
			})
		})

		
	}

	toggleMood(){
		this.editMood = !this.editMood;
	}

	toggleRange(){
		this.editRange = !this.editRange;
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

	model = {
		user: new User(),
		moodStatus: "",

	}
	errors = {
		mood: ""
	}

	moodChange(){
		console.log(this.model);
		this.model.user.moodStatus = this.model.moodStatus;

		this.auth.getUser().then((user) => {
			//this.model.user.uid = user.uid;
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);
			// console.log(user.data.moodStatus);

				this.errors.mood = "Your mood status has been updated!"
			//this.router.navigateByUrl('map');
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

	//Invisibility Toggle 0=Invisible, 4hour, 12hour, 24hour, 100=Visible
	visibility;
	// visibility = this.model.user.visability;

	setVisible(number){
		this.visibility = number;
		this.model.user.visibility = number;

		this.auth.getUser().then((user) => {
		//this.model.user.uid = user.uid;
		this.db.updateUser(this.model.user).then((data) => {
			console.log(data);
			//this.success.changeInfoS = "Your information has been updated!"
			//this.router.navigateByUrl('map');
		}).catch((err)=>{
			console.error(err);
			//this.errors.changeInfoE = "Your information has NOT been updated!"

			//Form rejected for some reason
		})
	//this.success.changeInfoS = "Your information has been updated!"
});
	}


	updateFilter(){
		this.auth.getUser().then((user) => {
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);
			}).catch((err)=>{
				console.error(err);
			})
		});
	}


	particlesConfig;
	submitted = false;


	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService, public loc: LocationService ) {
		this.auth.isAuthed().then((user) => {
			console.log("Authed:",user)
			this.model.user.uid = user.uid;
		});  


		this.auth.getUser().then((user) => {
			this.db.getUser(user.uid).then((userData) => {
				this.model.user = userData
				console.log(userData)
				this.visibility = this.model.user.visibility;
			})

		});



		loc.getLocation().then((l)=> {
			auth.getUser().then((u) => {
				db.storeLocation(l, u.uid).then((d) =>{
					console.log(d);

					db.getNearbyUsers(u.uid).then((nearbyUsers) => {
						console.log("Nearby:",nearbyUsers);
						this.nearbyUsers = nearbyUsers;
						this.nearbyUsers.forEach((user) => {
							user.distanceInMiles = Math.round((user.distance/5280)*100)/100;
						})
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
				this.model.user = userData;
				this.model.moodStatus = userData.moodStatus
				console.log(userData)
			})
		});
	}

	ngOnInit() {
	}

}
