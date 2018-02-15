import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

	constructor(public pConfig: ParticlesConfigService) {}

	ngOnInit() {}

}
