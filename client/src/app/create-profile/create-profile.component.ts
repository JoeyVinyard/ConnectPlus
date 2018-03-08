import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { LinkedInService} from 'angular-linkedin-sdk';
@Component({
	selector: 'app-create-profile',
	templateUrl: './create-profile.component.html',
	styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

	model = {
		user: new User()
	}

	particlesConfig;
	submitted = false;

	submit(){
		this.auth.getUser().then((user) => {
			this.model.user.uid = user.uid;
			this.db.createUser(this.model.user).then((data) => {
				console.log(data);
				this.router.navigateByUrl('map');
			}).catch((err)=>{
				console.error(err);
				//Form rejected for some reason
			})
		})
	}	

	// database = firebase.database();
	//  user = firebase.auth().currentUser;

	// writeUserData(user, name, email, birthdate) {
	//   firebase.database().ref('users/' + user).set({
	//     username: name,
	//     email: email,
	//     birthdate : birthdate
	//   });
	// }
	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private fb : FacebookService, private db: DatabaseService) {
		fb.init({
			appId: '146089319399243',
			version: 'v2.12'
		});

		this.auth.isAuthed().then((user) => {
			console.log("Authed:",user)
		});
	}

	login() {
		this.fb.login()
		.then((res: LoginResponse) => {
			console.log('Logged in', res);
		})
		.catch(this.handleError);
	}



	loginWithOptions() {

		const loginOptions: LoginOptions = {
			enable_profile_selector: true,
			return_scopes: true,
			scope: 'public_profile,user_friends,email,pages_show_list,read_custom_friendlists'
		};


		this.fb.login(loginOptions)
		.then((res: LoginResponse) => {
			console.log('Logged in', res);
		}).then(() => {
			this.fb.api('/me/taggable_friends')
			.then((res: any) => {
				console.log('Got the users friends', res);

			})
		})
		.catch(this.handleError);


		/*Need to make a promise to make sure the previous call runs before the next call, not sure how to do that yet, will ask joey tomorrow */
	/* setTimeout(this.fb.api('/me/friends')
	.then((res: any) => {
	console.log('Got the users friends', res);
	})
	.catch(this.handleError), 1000);*/

}

getLoginStatus() {
	this.fb.getLoginStatus()
	.then(console.log.bind(console))
	.catch(console.error.bind(console));
}


	/**
	* Get the user's profile
	*/
	getProfile() {
		this.fb.api('/me')
		.then((res: any) => {
			console.log('Got the users profile', res);
		})
		.catch(this.handleError);
	}


	/**
	* Get the users friends
	*/
	getFriends() {
		this.fb.api('/me/friends')
		.then((res: any) => {
			console.log('Got the users friends', res);
		})
		.catch(this.handleError);
	}

	private handleError(error) {
		console.error('Error processing action', error);
	}


	ngOnInit() {
	}

}
