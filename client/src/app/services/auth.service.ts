import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { User } from 'firebase';

@Injectable()
export class AuthService {
	
	private user: User;

	isAuthed(): Promise<any>{
		return new Promise((resolve, reject) => {
			this.afAuth.authState.subscribe((user) => {
				resolve(!!user);
			});
		});
	}
	login(email, password): Promise<any>{
		return this.afAuth.auth.signInWithEmailAndPassword(email,password);
	}
	logout(){
		return this.afAuth.auth.signOut();
	}
	signup(email, password): Promise<any>{
		return this.afAuth.auth.createUserWithEmailAndPassword(email,password);	
	}

	resetpassowrd(email){
		return this.afAuth.auth.sendPasswordResetEmail(email);
	}

	constructor(private afAuth: AngularFireAuth) {
		this.afAuth.auth.onAuthStateChanged((user) => {
			this.user = user;
		});
	}

}
