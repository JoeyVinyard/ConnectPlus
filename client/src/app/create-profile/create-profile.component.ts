import { Component, OnInit } from '@angular/core';
import { particlesConfig } from '../services/particles';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  particlesConfig;

	constructor() {
		this.particlesConfig = particlesConfig;
	}


  ngOnInit() {
  }

}
