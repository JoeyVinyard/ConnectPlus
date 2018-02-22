import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
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
constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private fb : FacebookService) {
	fb.init({
      appId: '146089319399243',
      version: 'v2.12'
    });
	console.log("yay?")
this.auth.isAuthed().then((user) => {
    console.log("Authed:",user)
});
		
	}

	login() {
    this.fb.login()
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
      })
      .catch(this.handleError);
  }

  /**
   * Login with additional permissions/options
   */


  loginWithOptions() {

    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };


    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
      })
      .catch(this.handleError);

      
      /*Need to make a promise to make sure the previous call runs before the next call, not sure how to do that yet, will ask joey tomorrow */
   /* setTimeout(this.fb.api('/me/friends')
      .then((res: any) => {
        console.log('Got the users friends', res);
      })
      .catch(this.handleError), 1000);*/
      return this.getFriends();
  }

  getLoginStatus() {
    this.fb.getLoginStatus()
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  }


  /**
   * Get the user's profile
   */
  getProfile() {
    this.fb.api('/me')
      .then((res: any) => {
        console.log('Got the users profile', res);
      })
      .catch(this.handleError);
  }


  /**
   * Get the users friends
   */
  getFriends() {
    this.fb.api('/me/friends')
      .then((res: any) => {
        console.log('Got the users friends', res);
      })
      .catch(this.handleError);
  }

  private handleError(error) {
    console.error('Error processing action', error);
  }


  ngOnInit() {
  }

}
