import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user';
//import { User } from 'firebase';

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
		password: ""
		user: User
	}

	particlesConfig;
	submitted = false;


submit(){
		console.log(this.model);
	}	




del(){

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
