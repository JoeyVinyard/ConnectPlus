import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { User } from '../services/user';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {


	errors = {
		email: "",
	}
	model = {
		password: "",
		user: new User(),
	}

	particlesConfig;
	submitted = false;

	submit(){

		console.log(this.model);


		if(this.model.user.newPass && this.model.user.conNewPass && (this.model.user.newPass == this.model.user.conNewPass)){

			var changepass = this.model.user.newPass;
			this.model.user.newPass = ""
			this.model.user.conNewPass = ""
			this.auth.getUser().then((user) => {
				console.log(user);
				user.updatePassword(changepass).then(function() {
						  // Update successful.
						//  console.log("password updated");
						
						console.log("hello",this.model.user.conNewPass);

					}).catch(function(error) {
						  // An error happened.
						});
				});

		}
		if(this.model.user.newEmail){
			var changeemail = this.model.user.newEmail;
			this.model.user.newEmail = "";
			this.auth.getUser().then((user) => {
				//var user = firebase.auth().currentUser;

				user.updateEmail(changeemail).then(function() {
					console.log(user);
					  // Update successful.
					  // console.log("password email");


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



	}	

changeemail(){

}

changepass(){
	console.log(this.model);

this.auth.reauthenticate(this.model.user.oldPass).then((credential) => {
		//this.auth.deleteUser();	
	//	this.model.user.deletePassword = "";
	
		if(this.model.user.newPass && this.model.user.conNewPass && (this.model.user.newPass == this.model.user.conNewPass)){

			var changepass = this.model.user.newPass;
			this.model.user.newPass = ""
			this.model.user.conNewPass = ""
			this.model.user.oldPass = ""
			
			this.auth.getUser().then((user) => {
				console.log(user);
				user.updatePassword(changepass).then(function() {
						  // Update successful.
						//  console.log("password updated");
						
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
		})
}


	del(){

	this.auth.reauthenticate(this.model.user.deletePassword).then((credential) => {
		this.auth.deleteUser();	
		this.model.user.deletePassword = "";
	})
	}






	
	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService) {
		this.auth.isAuthed().then((user) => {
			console.log("Authed:",user)
		});
		
	}
	ngOnInit() {}



}
