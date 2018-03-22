import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';

import { User } from '../services/user';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

	constructor(public pConfig: ParticlesConfigService, public dbs: DatabaseService) {
		

	}

	ngOnInit() {}

}
