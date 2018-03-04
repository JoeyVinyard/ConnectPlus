import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { User } from '../services/user';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {


	errors = {
		email: "",
		newPass: "",
		oldPass: "",
		conPass: ""
	}
	model = {
		password: "",
		user: new User(),
	}

	particlesConfig;
	submitted = false;

	

changeemail(){
console.log(this.model);
	this.auth.reauthenticate(this.model.user.password).then((credential) => {
	
		if(this.model.user.newEmail){
			var changeemail = this.model.user.newEmail;
			this.model.user.newEmail = "";
			this.model.user.password = "";
			this.auth.getUser().then((user) => {

				user.updateEmail(changeemail).then(function() {
					console.log(user);
					  // Update successful.

					}).catch(function(error) {
					  // An error happened.
					});
				});
		}else{
			this.auth.getUser().then((user) => {
				console.log(this.model);
				this.model.user.uid = user.uid;
				this.db.updateUser(this.model.user);
			})
		}
	})

}



	verifyPass(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		
		//Sanitize input here
		if(!this.model.user.oldPass)
			this.errors.oldPass = "Please enter your password.";
		if(!this.model.user.newPass)
			this.errors.newPass = "Please enter your password.";
		else if(this.model.user.newPass.length<6)
			this.errors.newPass = "Password must be at least 6 characters long."
		if(!this.model.user.conNewPass)
			this.errors.conPass = "Please confirm your password.";
		if(this.model.user.newPass != this.model.user.conNewPass && !this.errors.oldPass && !this.errors.conPass)
			this.errors.conPass = "Passwords must match!";
		if((this.model.user.newPass ==this.model.user.oldPass || this.model.user.oldPass == this.model.user.conNewPass)&& !this.errors.oldPass && !this.errors.conPass){
			this.errors.newPass = "why are you changing it to the same?";
			this.errors.conPass = "hello pick something different";
		}

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}



changepass(){
	console.log(this.model);
if(!this.verifyPass()){
this.auth.reauthenticate(this.model.user.oldPass).then((credential) => {
	
		if(this.model.user.newPass && this.model.user.conNewPass && (this.model.user.newPass == this.model.user.conNewPass)){

			var changepass = this.model.user.newPass;
			this.model.user.newPass = "";
			this.model.user.conNewPass = "";
			this.model.user.oldPass = "";
			
			this.auth.getUser().then((user) => {
				console.log(user);
				user.updatePassword(changepass).then(function() {
						  // Update successful.
						
						console.log("hello",this.model.user.conNewPass);

					}).catch(function(error) {
						  // An error happened.
						});
				});
		}
		else{
			this.auth.getUser().then((user) => {
				console.log(this.model);
				this.model.user.uid = user.uid;
				this.db.updateUser(this.model.user);
			})
		}
		}).catch((err) => {
				this.errors.oldPass = "No.";
		});
}

}


	del(){

	this.auth.reauthenticate(this.model.user.deletePassword).then((credential) => {
		this.auth.deleteUser();	
		this.model.user.deletePassword = "";
	})
	}
	
	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService, private fb : FacebookService,) {
		this.auth.isAuthed().then((user) => {
			console.log("Authed:",user)
		});	

		fb.init({
			appId: '146089319399243',
			version: 'v2.12',
			cookie: true
		});
		
	}

	link_facebook(){
		const loginOptions: LoginOptions = {
			enable_profile_selector: true,
			return_scopes: true,
			scope: 'public_profile,user_friends,email,pages_show_list,read_custom_friendlists'
		};

		/*todo: Check if loggedin already */
		this.fb.getLoginStatus()
		.then(res=>{
			if(res && res.status === 'unknown'){
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
			}else{
				console.log("Attempted to login when already logged in. We probably want to display an error message here");
			}
		}

	}

	logout_facebook(){
		this.fb.getLoginStatus()
      .then(res=>{
        if(res && res.status === 'connected'){
        	console.log("Logging out")
          this.fb.logout()

            .then(res=>{console.log(res)})
            .catch(this.handleError);
        }
      }).catch(this.handleError);

      this.getLoginStatus();
	}

	getLoginStatus() {
    this.fb.getLoginStatus()
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  }

	ngOnInit() {}

	private handleError(error) {
		console.error('Error processing action', error);
	}
}
