 import { Injectable } from '@angular/core';
 import { Component } from '@angular/core';
 import { AngularFireAuth } from 'angularfire2/auth';

 @Injectable()
 export class AuthService {

   constructor(private afAuth: AngularFireAuth) { 

   }
   signup(email, password){

   }
   login(email, password){
   	//We return a promise here because it is async
   	// return this.afAuth.auth.signInWithEmailAndPassword(email, password)
   }
   logout(){
   	this.afAuth.auth.signOut();
   }
}
