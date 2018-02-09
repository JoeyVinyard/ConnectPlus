 import { Injectable } from '@angular/core';
 import { Component } from '@angular/core';
 import { AngularFireAuth } from 'angularfire2/auth';
 import * as firebase from 'firebase/app';


 @Injectable()
 export class AuthService {

   constructor(public afAuth: AngularFireAuth) { 

   }
   login(){
   	this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());//Creates popup, will be replaced later
   }
   logout(){
   	this.af.Auth.auth.signOut();
   }

}
