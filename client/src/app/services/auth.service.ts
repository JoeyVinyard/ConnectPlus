import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'

@Injectable()
export class AuthService {
	signup(email, password){
		console.log(email,password);
	}
	login(email, password){

	}
	logout(){
		this.afAuth.auth.signOut();
	}
	constructor(private afAuth: AngularFireAuth) { 

	}

}
