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
	logout(): Promise<any>{
		return this.afAuth.auth.signOut();
	}
	signup(email, password): Promise<any>{

		return this.afAuth.auth.createUserWithEmailAndPassword(email,password);	
	}
	emailver(user: User): Promise<any>{
		return this.user.sendEmailVerification();
	}
	deleteUser(user:User): Promise<any>{
		return this.user.delete();
	}
	// signout(user:User): Promise<any>{
	// 	return this.user.signOut();
	// }

	resetpassword(email){
		return this.afAuth.auth.sendPasswordResetEmail(email);
	}



	constructor(private afAuth: AngularFireAuth) {
		this.afAuth.auth.onAuthStateChanged((user) => {
			this.user = user;
		});
	}

}
