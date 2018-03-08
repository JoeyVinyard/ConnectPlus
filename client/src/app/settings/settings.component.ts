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
		pass: "",
		newEmail:"",
		newPass: "",
		oldPass: "",
		conPass: "", 
		cred: "",
		changePassMess: "",
		changeEmailMess: ""
	}
	model = {
		password: "",
		user: new User(),
	}
	

	particlesConfig;
	submitted = false;

	verifyEmail(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if(!this.model.user.newEmail || !(new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+")).exec(this.model.user.newEmail)){

			this.errors.newEmail = "Please provide a valid email.";
							noErr = false;

		}


		
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}

	changeemail(){
		console.log(this.model);
		if(this.verifyEmail()){
			this.auth.reauthenticate(this.model.user.password).then((credential) => {

				if(this.model.user.newEmail){
					var changeemail = this.model.user.newEmail;

					this.auth.getUser().then((user) => {

						user.updateEmail(changeemail).then(function() {
							console.log(user);
					  // Update successful.

					}).catch(function(error) {
					  // An error happened.
					  // this.model.user.password = "";
					  this.errors.changeEmailMess = "Email Change Failed";
					  if(error.code == "auth/invalid-user-token" || error.code == "auth/email-already-in-use" || error.code == "auth/invalid-email" )
							this.errors.newEmail = "Email already in use!";

					});
				});
				this.model.user.newEmail = "";
					this.model.user.password = "";
					this.errors.changeEmailMess = "Email Change Successful"
				}
				else{
					this.auth.getUser().then((user) => {
						console.log(this.model);
						this.model.user.uid = user.uid;
						this.db.updateUser(this.model.user);
					})
				}
			}).catch((err) => {
				this.errors.changeEmailMess = "Email Change Failed";
				this.errors.pass = "Please enter your password.";
				this.model.user.password = "";

			});
		}
		else{
			this.errors.changeEmailMess = "Email Change Failed";
			this.model.user.newEmail = "";
			this.model.user.password = "";
		}

	}



	verifyPass(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		
		
		//Sanitize input here
		if(!this.model.user.oldPass && this.model.user.oldPass.length < 6)
			this.errors.oldPass = "Please enter your password.";
		if(!this.model.user.newPass)
			this.errors.newPass = "Please enter your new password.";
		if(this.model.user.newPass.length<6)
			this.errors.newPass = "Password must be at least 6 characters long.";
		if(!this.model.user.conNewPass)
			this.errors.conPass = "Please confirm your password.";
		if(this.model.user.newPass != this.model.user.conNewPass && !this.errors.oldPass && !this.errors.conPass)
			this.errors.conPass = "Passwords must match!";
		// if((this.model.user.newPass ==this.model.user.oldPass || this.model.user.oldPass == this.model.user.conNewPass)&& !this.errors.oldPass && !this.errors.conPass){
		// 	this.errors.newPass = "Please pick a different password";
		// 	this.errors.conPass = "Please pick a different password";
		// }
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
		if(this.verifyPass()){
			this.auth.reauthenticate(this.model.user.oldPass).then((credential) => {
				
				if(this.model.user.newPass && this.model.user.conNewPass && (this.model.user.newPass == this.model.user.conNewPass)){

					var changepass = this.model.user.newPass;
					
					if((this.model.user.newPass ==this.model.user.oldPass || this.model.user.oldPass == this.model.user.conNewPass)){
						this.errors.newPass = "Please pick a different password";
						this.errors.conPass = "Please pick a different password";
						this.model.user.newPass = "";
						this.model.user.conNewPass = "";
					}
					
					else{
						this.auth.getUser().then((user) => {
							console.log(user);
							console.log(this.model);
							user.updatePassword(changepass).then(function() {
						  // Update successful.
						  console.log("hello",this.model.user.conNewPass);
						  console.log("hello",this.model.user.conNewPass);

						}).catch(function(error) {
							this.errors.newPass = "";
							this.errors.conPass = "";
							this.errors.oldPass = "";
							this.model.user.newPass = "" ;
							this.model.user.conNewPass = "";
							this.model.user.oldPass = "";
							this.errors.changePassMess = "Password Change Failed";
						});
					});
						this.errors.changePassMess = "password change worked!!!";
						this.model.user.newPass = "" ;
						this.model.user.conNewPass = "";
						this.model.user.oldPass = "";
					}

				}
				else{
					this.auth.getUser().then((user) => {
						console.log(this.model);
						this.model.user.uid = user.uid;
						this.db.updateUser(this.model.user);
					})
				}
			}).catch((err) => {
				this.errors.newPass = "";
				this.errors.conPass = "";
				this.errors.oldPass = "Please enter your password.";
				this.errors.changePassMess = "Password Change Failed";
				this.model.user.newPass = "" ;
				this.model.user.conNewPass = "";
				this.model.user.oldPass = "";
			});
		}
		else{
			
			this.errors.newPass = "";
			this.errors.conPass = "";
			this.errors.oldPass = "";
			
			this.errors.changePassMess = "Password Change Failed";
			this.model.user.newPass = "" ;
			this.model.user.conNewPass = "";
			this.model.user.oldPass = "";
		}

	}


	del(){

		this.auth.reauthenticate(this.model.user.deletePassword).then((credential) => {
			this.auth.deleteUser();	
			this.model.user.deletePassword = "";
			this.model.user.email = "";
			this.router.navigateByUrl("");
		}).catch((err) => {
			this.errors.cred = "Incorrect Email and/or Password";
			this.model.user.deletePassword = "";
		});
	}
	


/* not working idk why
	del(){
		this.auth.reauthenticate(this.model.user.deletePassword).then((credential)  => {

			this.auth.reauthenticate(this.model.user.email).then((credential) => {
				this.auth.deleteUser();	
				this.model.user.deletePassword = "";
				this.model.user.email = "";
			}).catch((err) => {
				this.errors.cred = "Incorrect Email and/or Password";
				this.model.user.deletePassword = "";
			});


		}).catch((err) => {
			this.errors.cred = "Incorrect Email and/or Password";
			this.model.user.deletePassword = "";
		});


	}
	*/
	
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
		})

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
