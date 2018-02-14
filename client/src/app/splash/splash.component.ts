import { Component, OnInit } from '@angular/core';
import { particlesConfig } from '../services/particles';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

	particlesConfig;

	constructor() {
		this.particlesConfig = particlesConfig;
	}

	ngOnInit() {}

}
