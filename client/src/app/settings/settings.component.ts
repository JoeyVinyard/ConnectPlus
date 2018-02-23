import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
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
		user: new User(),
		password: ""
		
	}

	particlesConfig;
	submitted = false;

submit(){

		console.log(this.model);


		if(this.model.user.newPass && this.model.user.conNewPass){
					var changepass = this.model.user.newPass;
		
				this.auth.getUser().then((user) => {
					console.log(user);
					user.updatePassword(this.model.user.newPass).then(function() {
						  // Update successful.
						  console.log("password updated");
						}).catch(function(error) {
						  // An error happened.
						});
				});

		}
		if(this.model.user.newEmail){
			var changepass = this.model.user.newPass;
		
			this.auth.getUser().then((user) => {
				//var user = firebase.auth().currentUser;

			user.updateEmail(this.model.user.newEmail).then(function() {
						console.log(user);
					  // Update successful.
					   console.log("password email");

					}).catch(function(error) {
					  // An error happened.
					});
			});
		}



	}	




del(){
		console.log(this.model);

	this.auth.reauthenticate(this.model.password).then((credential) => {
		this.auth.deleteUser();	
	})
	}

					

		


	
constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router) {
this.auth.isAuthed().then((user) => {
    console.log("Authed:",user)
});
		
	}
	ngOnInit() {}


  
}
