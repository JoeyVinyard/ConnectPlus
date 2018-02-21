import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

	model = {
		sports1: false, 
		sports2: false, 
		sports3: false, 
		sports4: false, 
		sports5: false, 
		sports6: false, 
		sports7: false, 
		sports8: false, 
		sports9: false, 
		sports10: false, 

		music1:false,
		music2:false,
		music3:false,
		music4:false,
		music5:false,
		music6:false,
		music7:false,
		music8:false,
		music9:false,
		music10:false,

		food1:false,
		food2:false,
		food3:false,
		food4:false,
		food5:false,
		food6:false,
		food7:false,
		food8:false,
		food9:false,
		food10:false
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



	constructor(public pConfig: ParticlesConfigService) {}


  ngOnInit() {
  }

}
