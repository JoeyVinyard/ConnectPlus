import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth'
import { User } from '../services/user';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

  authed = false;

	constructor(private auth: AuthService, private afAuth: AngularFireAuth, public pConfig: ParticlesConfigService, public dbs: DatabaseService) {
		afAuth.authState.subscribe((authState) => {
			this.authed = !!authState;
		})
	}

	ngOnInit() {}

}
