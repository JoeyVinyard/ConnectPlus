import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { Injectable } from '@angular/core';

@Injectable()
export class FacebookLogin {


  constructor(
    private fb: FacebookService
  ) {

    console.log('Initializing Facebook');

    fb.init({
      appId: '146089319399243',
      version: 'v2.12'
    });
    console.log('Facebook initialized');
  }

  /**
   * Login with minimal permissions. This allows you to see their public profile only.
   */
  login() {
  	console.log("login called");
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


  /**
   * Show the share dialog
   */
  share() {

    const options: UIParams = {
      method: 'share',
      href: 'https://github.com/zyramedia/ng2-facebook-sdk'
    };

    this.fb.ui(options)
      .then((res: UIResponse) => {
        console.log('Got the users profile', res);
      })
      .catch(this.handleError);

  }


  playVideo() {
    this.video.play();
  }

  onVideoEvent(ev) {
    console.log('Video event fired: ' + ev);
  }

  pauseVideo() {
    this.video.pause();
  }



  /**
   * This is a convenience method for the sake of this example project.
   * Do not use this in production, it's better to handle errors separately.
   * @param error
   */
  private handleError(error) {
    console.error('Error processing action', error);
  }

/*
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
	});
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

  */
}



