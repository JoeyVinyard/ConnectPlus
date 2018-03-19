import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { User } from '../services/user';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { LinkedinService } from '../services/Linkedin.service';//LinkedInService
@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {


	errors = {
		//change info errors
		changeInfoE: "",
		FnameError:"",
		LnameError:"",
		//change email errors
		emailChangeE: "",
		currentEmailChange: "",
		newEmail: "",
		currentEmail: "",
		//change password errors
		passwordChangeE: "",
		newPass: "",
		oldPass: "",
		conPass: "", 
		//delete user
		email: "",
		pass: "",
		cred: "",
	}
	success = {
		//change email success
		emailChangeS: "",
		//change password success
		passwordChangeS:"",
		//change info success
		changeInfoS: "",
	}
	model = {
		user: new User(),
		//del user var
		password: "",
		email:"",
		//change email vars
		currentEmail: "",
		newEmail: "", 
		emailChangePass: "",
		//change password vars
		currentPassword:"",
		newPassword:"",
		conPassword:""
	}


	particlesConfig;
	submitted = false;

	//Div Visibility Vars
	invShow = false;
	genShow = false;
	secShow = false;
	conShow = false;
	intShow = false;
	fedShow = false;
	delShow = false;


	faceShow = false;
	instShow = false;
	linkShow = false;
	blackShow = false;

	//Social Media Connected Vars
	inFacebook = false;
	inLinkedIn = false;
	inBlackboard = false;
	inInstagra = false;

	//Invisibility Toggle 0=Invisible, 4hour, 12hour, 24hour, 100=Visible
	visibility = 0;
	// visibility = this.model.user.visability;
	



	url = '';
	onSelectFile(event) {
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event:any) => { // called once readAsDataURL is completed
       // this.url = event.target.result;
       this.model.user.url = event.target.result;
       this.updateInfo();
       console.log(this.model.user.url);

   }
}
}



toggleDiv(name){
	if(name == "invShow"){
		this.invShow = !this.invShow;
	}
	else if(name == "genShow"){
		this.genShow = !this.genShow;
	}
	else if(name == "secShow"){
		this.secShow = !this.secShow;
	}
	else if(name == "conShow"){
		this.conShow = !this.conShow;
	}
	else if(name == "intShow"){
		this.intShow = !this.intShow;
	}
	else if(name == "fedShow"){
		this.fedShow = !this.fedShow;
	}
	else if(name == "delShow"){
		this.delShow = !this.delShow;
	}

	else if(name == "faceShow"){
		this.faceShow = !this.faceShow;
	}
	else if(name == "instShow"){
		this.instShow = !this.instShow;
	}
	else if(name == "linkShow"){
		this.linkShow = !this.linkShow;
	}
	else if(name == "blackShow"){
		this.blackShow = !this.blackShow;
	}
}

setVisible(number){
	this.visibility = number;
		//this.model.user.visability = number;

		


	}

	clearing(){

		this.errors.email = "";
		this.errors.pass = "";
		this.errors.newEmail = "";
		this.errors.currentEmail = "";
		this.errors.newPass = "";
		this.errors.oldPass = "";
		this.errors.conPass = "";
		this.errors.cred = "";
		this.errors.passwordChangeE = "";
		this.success.passwordChangeS = "";
		this.errors.emailChangeE = "";
		this.errors.emailChangeE = "";
		this.errors.changeInfoE = "";
		this.success.changeInfoS = "";
		this.errors.FnameError = "";
		this.errors.LnameError = "";

		this.auth.getUser().then((user) => {
			this.model.user.uid = user.uid;
			this.model.user.firstName = user.firstName;

			this.db.getUser(user.uid).then((userData) => {

				this.model.user = userData
				console.log(userData)
			})



		});

	}




	vis(){
		this.model.user.visability = this.visibility
		this.auth.getUser().then((user) => {
			//this.model.user.uid = user.uid;
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);
				//this.router.navigateByUrl('map');
			}).catch((err)=>{
				console.error(err);

				//Form rejected for some reason
			})
		});

	}





	verifyValid(){

		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if(this.model.user.firstName && !(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.firstName))
			this.errors.FnameError = "Please provide a valid first name."
		if(this.model.user.lastName && !(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.lastName))
			this.errors.LnameError = "Please provide a valid last name."

		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}




	updateInfo(){

		console.log(this.model);
		if(this.verifyValid()){
			this.model.user.fullName = this.model.user.firstName + " " + this.model.user.lastName;

			this.auth.getUser().then((user) => {
			//this.model.user.uid = user.uid;
			this.db.updateUser(this.model.user).then((data) => {
				console.log(data);
				this.success.changeInfoS = "Your information has been updated!"
				//this.router.navigateByUrl('map');
			}).catch((err)=>{
				console.error(err);
				this.errors.changeInfoE = "Your information has NOT been updated!"

				//Form rejected for some reason
			})
			this.success.changeInfoS = "Your information has been updated!"

		});
		}
		else{
			this.errors.changeInfoE = "Looks like you tried to change your name to something invalid. \nYour information has NOT been updated!"
		}
	}

	verifyEmail(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if(!this.model.newEmail || !(new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+")).exec(this.model.newEmail)){
			this.errors.newEmail = "Please provide a valid email.";
		}
		else if(this.model.newEmail == this.model.currentEmail)
			this.errors.newEmail = "Please provide differnt email.";

		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		return noErr;
	}

	changeemail(){
		this.success.emailChangeS ="";
		console.log(this.model);
		if(this.verifyEmail()){
			this.auth.reauthenticate2(this.model.currentEmail,this.model.emailChangePass).then((credential) => {

				if(this.model.newEmail){
					var changeemail = this.model.newEmail;

					this.auth.getUser().then((user) => {
						user.updateEmail(changeemail).then(() => {
							this.model.user.email = this.model.newEmail;
							this.model.email="";
							this.success.emailChangeS = "Email Change Successful";
							this.model.newEmail = "";
							this.model.emailChangePass = "";
							this.errors.emailChangeE = "";
						}).catch((err) => {
							this.errors.emailChangeE = "Email Change Failed1";
							if(err.code == "auth/invalid-user-token" || err.code == "auth/email-already-in-use" || err.code == "auth/invalid-email" )
								this.errors.newEmail = "Email already in use!"
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
				this.errors.emailChangeE = "Looks like you did not enter the correct email/password for this account. Email Change Failed";
				this.model.emailChangePass = "";
				this.model.newEmail = "";

			});
		}
		else{
			this.errors.emailChangeE = "Email Change Failed2";
			this.model.newEmail = "";
			this.model.emailChangePass = "";
		}

	}

	verifyPass(){

		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		var noErr = true;
		
		if(!this.model.currentPassword)
			this.errors.oldPass = "Please enter your password.";

		if(!this.model.newPassword)
			this.errors.newPass = "Please enter your new password.";

		else if(this.model.newPassword.length<6)
			this.errors.newPass = "Password must be at least 6 characters long.";
		if(!this.model.conPassword)
			this.errors.conPass = "Please confirm your password.";
		if(this.model.newPassword != this.model.conPassword && !this.errors.oldPass && !this.errors.conPass)
			this.errors.conPass = "Passwords must match!";

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		return noErr;
	}

	changepass(){

		console.log(this.model)
		if(this.verifyPass()){
			this.auth.reauthenticate(this.model.currentPassword).then((credential) => {
				
				if((this.model.newPassword ==this.model.currentPassword || this.model.currentPassword == this.model.conPassword)){
					this.errors.newPass = "Please pick a different password";
					this.errors.conPass = "Please pick a different password";
					this.model.newPassword = "";
					this.model.conPassword = "";
				}
				else if((this.model.newPassword == this.model.conPassword)){

					var changepass1 = this.model.newPassword;
					
					this.auth.getUser().then((user) => {
						console.log(user);
						console.log(this.model);
						user.updatePassword(changepass1).then(() => {
							this.model.newPassword = "" 
							this.model.conPassword = ""
							this.model.currentPassword = ""

							this.success.passwordChangeS = "password change worked!!!";
						}).catch((err) => {
							//console.log(this.errors)
							this.errors.newPass = ""
							this.errors.conPass = ""
							this.errors.oldPass = ""
							this.model.newPassword = "" 
							this.model.conPassword = ""
							this.model.currentPassword = ""
							this.errors.passwordChangeE = "Password Change Failed1"

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
				this.errors.newPass = "";
				this.errors.conPass = "";
				this.errors.oldPass = "Please enter your password.";
				this.errors.passwordChangeE = "Password Change Failed2";
				this.model.newPassword = "" ;
				this.model.conPassword = "";
				this.model.currentPassword = "";
			});
		}
		else if (!this.verifyPass()){
			this.errors.passwordChangeE = "Password Change Failed";
			this.model.newPassword = "" ;
			this.model.conPassword = "";
			this.model.currentPassword = "";
		}

	}

	// del(){
	// 	if(this.model.password && this.model.email){
	// 		this.auth.reauthenticate2(this.model.email, this.model.password).then((credential) => {
	// 			this.auth.deleteUser();	
	// 			this.model.password = "";
	// 			this.model.email = "";
	// 			this.router.navigateByUrl("");
	// 		}).catch((err) => {
	// 			this.errors.cred = "Incorrect Email and/or Password";
	// 			this.model.password = "";
	// 		});
	// 	}
	// 	else{
	// 		this.errors.cred = "No Email and/or Password entered";
	// 	}

	// }
	del(){
		if(this.model.password && this.model.email){
			this.auth.reauthenticate2(this.model.email, this.model.password).then((credential) => {
			// 	this.auth.getUser().then((user) => {
			// 		this.model.user.uid = user.uid;
			// 		this.model.user.firstName = user.firstName;

			// 		this.db.deleteUser(user).then((user) => {

			// 		})

			// });
			this.auth.deleteUser();	
			this.model.password = "";
			this.model.email = "";
			this.router.navigateByUrl("");
		}).catch((err) => {
			this.errors.cred = "Incorrect Email and/or Password";
			this.model.password = "";
		});
	}
	else{
		this.errors.cred = "No Email and/or Password entered";
	}

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
	
	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService, private fb : FacebookService, private li : LinkedinService) {
		this.auth.isAuthed().then((user) => {
			console.log("Authed:",user)
			this.model.user.uid = user.uid;
		});	


		this.auth.getUser().then((user) => {
			this.model.user.uid = user.uid;
			this.model.user.firstName = user.firstName;

			this.db.getUser(user.uid).then((userData) => {

				this.model.user = userData
				console.log(userData)
			})

		});

	// this.visibility = this.model.user.visability;


	fb.init({
		appId: '146089319399243',
		version: 'v2.12',
		cookie: true
	})

	this.logout_facebook();

}


link_linkedin(){
	this.li.getFriends(this.model.user.screenName)

		.then((data:any) => {
			console.log("Storing in database" + this.model.user.uid);
			this.db.storeTwitterFollowees(data.users, this.model.user.screenName, this.model.user.uid).then((data) => {
				console.log(data);
			});
		});
}

link_facebook(){
	const loginOptions: LoginOptions = {
		enable_profile_selector: true,
		return_scopes: true,
		scope: 'public_profile,user_friends,email,pages_show_list,read_custom_friendlists'
	};
	console.log(this.returnLoginStatus());
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
					this.db.storeFacebookFriends(res,this.model.user.uid).then((data) => {
						console.log(data);
						
					}).catch((err)=>{
						//this.errors.createError = "Facebook friends storage failed"

						console.error(err);
				//Form rejected for some reason
			})
					console.log('Got the users friends', res);
					this.inFacebook = true;

				})
			})
			.catch(this.handleError);
		}else{
			console.log("Attempted to login when already logged in. We probably want to display an error message here");
		}
	})

	console.log(this.inFacebook);

}


logout_facebook(){
	this.fb.getLoginStatus()
	.then(res=>{
		if(res && res.status === 'connected'){
			console.log("Logging out")
			this.fb.logout()

			.then(res=>{console.log(res)})
			.catch(this.handleError);
			this.inFacebook = false;
		}
	}).catch(this.handleError);

	this.getLoginStatus();
}
returnLoginStatus(){
	this.fb.getLoginStatus()
	.then(res=>{
		if(res && res.status === 'connected'){
			console.log(true);
			return true;

		}else{
			console.log(false);
			return false;
		}
	})
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
