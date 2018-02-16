import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { particlesConfig } from '../services/particles';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
	
	errors = {
		email: "",
		password: "",
	}
	model = {
		email: "",
		password: "",
	}
	particlesConfig;
	submitted = false;

	submit(){
		this.submitted = true;
		if(!this.verify()){
			this.submitted = false;
			return;
		}
		this.auth.login(this.model.email, this.model.password).then((user) => {
			//Success, redirect user to next page
		}).catch((err) => {
			this.submitted = false;
			this.submitted = false;
			if(err.code == "auth/invalid-email" || err.code == "auth/wrong-password"||err.code == "auth/user-not-found"||err.code == "auth/user-disabled")
				this.errors.email = "Email and/or password is invalid!"
		})
	}	



	verify(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		
		//Sanitize input here
		if(!this.model.email )
			this.errors.email = "Please enter your email.";
		else if(!(new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+")).exec(this.model.email))
			this.errors.email = "Please provide a valid email.";
		if(!this.model.password)
			this.errors.password = "Please enter your password.";

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		console.log(this.errors, noErr);
		return noErr;
	}


	constructor(private auth: AuthService) {
		this.particlesConfig = particlesConfig;
	}

	ngOnInit() {}

}
