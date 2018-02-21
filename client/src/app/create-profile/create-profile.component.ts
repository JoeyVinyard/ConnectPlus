import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

	model = {

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
