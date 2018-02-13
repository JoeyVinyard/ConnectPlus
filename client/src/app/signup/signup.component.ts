import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	model: {
		email: string,
		password: string,
		confpass: string
	}
	errors: {
		email: string,
		password: string,
		confpass: string
	}

	submit(){
		if(!this.verify())
			return;
		this.auth.signup(this.model.email, this.model.password);
	}	
	verify(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		
		//Sanitize input here
		if(!this.model.email)
			this.errors.email = "Please provide an email";
		if(!this.model.password)
			this.errors.password = "Please enter your password";
		if(!this.model.confpass)
			this.errors.confpass = "Please confirm your password";
		if(this.model.password != this.model.confpass && !this.errors.password && !this.errors.confpass)
			this.errors.confpass = "Passwords must match!";

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(!this.errors[key])
				noErr = false;
		})
		return noErr;
	}

	constructor(private auth: AuthService) {}

	ngOnInit() {
	}
}
