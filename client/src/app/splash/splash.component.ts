import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';
import {FacebookLogin } from '../services/facebook-request';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

	constructor(public pConfig: ParticlesConfigService, public facebookLogin: FacebookLogin) {
		//facebookLogin.login();
	}

	ngOnInit() {}

}
