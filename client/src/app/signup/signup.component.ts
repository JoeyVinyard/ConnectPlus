import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service'


@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	errors = {
		email: "",
		password: "",
		confpass: ""
		
	}
	model = {
		user:new User(),
	}
	particlesConfig;
	submitted = false;

	submit(){
		this.submitted = true;
		if(!this.verify()){
			this.submitted = false;
			return;
		}
		this.auth.signup(this.model.user.email, this.model.user.password).then((user) => {
			 //this.auth.emailver(user).then(() => { //idk if email is working
 				this.router.navigateByUrl("create");
			// }).catch((err) => {
	//		 	console.error(err);
	//		 })
		}).catch((err) => {
			this.submitted = false;
			this.submitted = false;
			if(err.code == "auth/invalid-user-token" || err.code == "auth/email-already-in-use" || err.code == "auth/invalid-email" )
				this.errors.email = "Email already in use!"
		});
	}	
	verify(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		
		//Sanitize input here
		if(!this.model.user.email || !(new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+")).exec(this.model.user.email))
			this.errors.email = "Please provide a valid email.";
		if(!this.model.user.password)
			this.errors.password = "Please enter your password.";
		else if(this.model.user.password.length<6)
			this.errors.password = "Password must be at least 6 characters long."
		if(!this.model.user.confpass)
			this.errors.confpass = "Please confirm your password.";
		if(this.model.user.password != this.model.user.confpass && !this.errors.password && !this.errors.confpass)
			this.errors.confpass = "Passwords must match!";

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}

	constructor(private dataS: DatabaseService, private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router) {}

	ngOnInit() {}
}
