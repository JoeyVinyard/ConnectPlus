import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ParticlesModule } from 'angular-particle';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import { SettingsComponent } from './settings/settings.component';
import { NavComponent } from './nav/nav.component';
import { SplashComponent } from './splash/splash.component';
import { UserComponent } from './user/user.component';

import { AuthService } from './services/auth.service'


import { fbConfig } from '../environments/firebase.config';
import { ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    MapComponent,
    ListComponent,
    SettingsComponent,
    NavComponent,
    SplashComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    ParticlesModule,
    RouterModule.forRoot(ROUTES),
    AngularFireModule.initializeApp(fbConfig, 'ConnecPlus'), 
    AngularFirestoreModule, 
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
