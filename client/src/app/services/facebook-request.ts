import {FacebookService, InitParams, LoginResponse} from 'ngx-facebook';
import { Injectable } from '@angular/core';

@Injectable()
export class FacebookLogin {

  constructor(private fb: FacebookService) {

    let initParams: InitParams = {
      appId: '146089319399243',
      xfbml: true,
      version: 'v2.12'
    };

    fb.init(initParams)

    /*.then((a) => {
   console.log(a);
	}).catch((err) => {
   console.error(err);
	});*/
    console.log('Initializing Facebook');
  }


  login() {

  	console.log(this);
  	console.log("This.fb: " + this.fb);
    this.fb.login()
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
      })
      .catch(this.handleError);
  }

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
}


