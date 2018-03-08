import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';
import { DatabaseService } from '../services/database.service';

import { User } from '../services/user';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

	constructor(public pConfig: ParticlesConfigService, public dbs: DatabaseService) {
		//Get single user
		dbs.getUser("Ag6wtowHyNcOikRxjTE3MR81xd63").then((d)=>{
			console.log("Certain User:",d);
		}).catch((err) => {
			console.error(err);
		})
		//Get multiple users
		dbs.getMultipleUsers(["WTMQkoqmFya5CxEdlMWr79xL6bG2", "Ag6wtowHyNcOikRxjTE3MR81xd63"]).then((d)=>{
			console.log("Certain users:",d);
		}).catch((err) => {
			console.error(err);
		})
		//Get all users
		dbs.getAllUsers().then((d) => {
			console.log("All Users:",d);
		}).catch((err) => {
			console.error(err);
		})
	}

	ngOnInit() {}

}
