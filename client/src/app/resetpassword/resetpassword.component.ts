import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { particlesConfig } from '../services/particles';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
 
	constructor(public pConfig: ParticlesConfigService) {}

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
		this.auth.resetpassword(this.model.email).then((user) => {
			//Success, redirect user to next page
		}).catch((err) => {
			this.submitted = false;
			
			if(err.code == "auth/invalid-email" || err.code == "auth/user-not-found"||err.code == "auth/user-disabled")
				this.errors.email = "Email is invalid!"
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
		

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		console.log(this.errors, noErr);
		return noErr;
	}

	ngOnInit() {}
}