import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	errors: {
		email: string,
		password: string,
		confpass: string
	}
	model: {
		email: string,
		password: string,
		confpass: string
	}
	submitted = false;

	submit(){
		this.submitted = true;
		if(!this.verify())
			return;
		this.auth.signup(this.model.email, this.model.password).then((user) => {
			//Success, redirect user to next page
		}).catch((err) => {
			this.submitted = false;
			Object.keys(this.model).forEach((key)=>{
				this.model[key] = null;
			});
			if(err.code == "auth/email-already-in-use")
				this.errors.email = "Email already in use!"
		})
	}	
	verify(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		
		//Sanitize input here
		if(!this.model.email)
			this.errors.email = "Please provide an email.";
		if(this.model.password.length<6)
			this.errors.password = "Password must be at least 6 characters long."
		if(!this.model.password)
			this.errors.password = "Please enter your password.";
		if(!this.model.confpass)
			this.errors.confpass = "Please confirm your password.";
		if(this.model.password != this.model.confpass && this.errors.password && this.errors.confpass)
			this.errors.confpass = "Passwords must match!";

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(!this.errors[key])
				noErr = false;
		})
		return noErr;
	}

	constructor(private auth: AuthService) {
		this.auth.signup("vinyardjoseph@gmail.com", "daddy123").then((user) => {
			console.log("Signup worked", user);
		}).catch((err) => {
			console.error(err);
		})
	}

	ngOnInit() {
	}
}
