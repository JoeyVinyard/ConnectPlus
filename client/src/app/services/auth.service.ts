import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'

@Injectable()
export class AuthService {
	signup(email, password): Promise<any>{
		console.log(email, password);
		//implement sign up using the createUserWithEmailAndPassword function in afAuth.auth
		//Return the promise
		return this.afAuth.auth.createUserWithEmailAndPassword(email,password);	
	}

	login(email, password): Promise<any>{
		console.log(email, password);
		//implement sign in using the signInWithEmailAndPassword function in afAuth.auth
		//Return the promise
		return this.afAuth.auth.signInWithEmailAndPassword(email,password);
	}
	logout(){
		return this.afAuth.auth.signOut();
	}

	constructor(private afAuth: AngularFireAuth) {}

}
