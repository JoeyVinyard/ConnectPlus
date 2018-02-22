import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

	model = {
		user: User
	}

	particlesConfig;
	submitted = false;

 





submit(){
	
			console.log(this.model);
			

	
	}	

// database = firebase.database();
//  user = firebase.auth().currentUser;

// writeUserData(user, name, email, birthdate) {
//   firebase.database().ref('users/' + user).set({
//     username: name,
//     email: email,
//     birthdate : birthdate
//   });
// }



constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router) {
this.auth.isAuthed().then((user) => {
    console.log("Authed:",user)
});
		
	}


  ngOnInit() {
  }

}
