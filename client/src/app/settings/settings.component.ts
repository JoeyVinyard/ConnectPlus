import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	constructor(public pConfig: ParticlesConfigService) {}
/*
errors = {
		email: "",
	}
	model = {
		email: "",
	}
	particlesConfig;
	submitted = false;


submit(){
		this.submitted = true;
		if(!this.verify()){
			this.submitted = false;
			return;
		}

		firebase.auth().onAuthStateChanged(function(user) {
			this.auth.deleteUser(user).then(() => {
				this.router.navigateByUrl("map");
			}).catch((err) => {
				console.error(err);
			})
		});
	}	



	verify(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})



if(!this.model.email )
			this.errors.email = "Please enter your email.";
		else if(!(new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+")).exec(this.model.email))
			this.errors.email = "Please provide a valid email.";
		

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		console.log(this.errors, noErr);
		return noErr;
	}

	constructor(public pConfig: ParticlesConfigService, private auth: AuthService, private router: Router) {}

	ngOnInit() {}
*/

  ngOnInit() {
  }
}
