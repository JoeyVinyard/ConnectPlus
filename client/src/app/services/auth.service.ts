import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import { User } from 'firebase';
import {Observable} from 'rxjs/observable';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
	
	private user: User;

	isAuthed(): Promise<any>{
		return new Promise((resolve, reject) => {
			this.afAuth.authState.subscribe((user) => {
				console.log(user);
				resolve(!!user);
			});
		});
	}
	getUser(): Promise<any>{
		return new Promise((resolve, reject) => {
			this.afAuth.authState.subscribe((user) => {
				resolve(user);
			})
		})
	}
	login(email, password): Promise<any>{
		return this.afAuth.auth.signInWithEmailAndPassword(email,password);
	}
	logout(): Promise<any>{
		return this.afAuth.auth.signOut();
	}
	signup(email, password): Promise<any>{

		return this.afAuth.auth.createUserWithEmailAndPassword(email,password);	
	}
	emailver(user: User): Promise<any>{
		return user.sendEmailVerification();
	}

	deleteUser(): Promise<any>{
		return this.user.delete();
	}


	resetpassword(email){
		return this.afAuth.auth.sendPasswordResetEmail(email);
	}

	reauthenticate(password){
		return this.user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(this.user.email, password));
		//return this.user.reauthenticateWithCredential(this.afAuth.auth.EmailAuthProvider.credential(this.user.email, password));
	}
	reauthenticate2(email,password){
		return this.user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(email, password));
		//return this.user.reauthenticateWithCredential(this.afAuth.auth.EmailAuthProvider.credential(this.user.email, password));
	}


	constructor(private afAuth: AngularFireAuth) {
		this.afAuth.auth.onAuthStateChanged((user) => {
			this.user = user;
		});
	}

}
