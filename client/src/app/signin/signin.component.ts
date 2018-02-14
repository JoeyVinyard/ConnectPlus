import { Component, OnInit } from '@angular/core';
import { particlesConfig } from '../services/particles';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

	particlesConfig;

	constructor() {
		this.particlesConfig = particlesConfig;
	}

	ngOnInit() {}

}
