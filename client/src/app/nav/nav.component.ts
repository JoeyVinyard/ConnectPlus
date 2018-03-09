import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth'
import { Router } from '@angular/router';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

	authed = false;

	constructor(private auth: AuthService, private router: Router, private afAuth: AngularFireAuth) {
		afAuth.authState.subscribe((authState) => {
			this.authed = !!authState;
		})
	}

	logout(){
		this.auth.logout().then(() => {
			this.router.navigateByUrl("/");
			console.log("Successful Logout");
		})
	}

	ngOnInit() {
	}

}
