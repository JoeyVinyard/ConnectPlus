import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ParticlesModule } from 'angular-particle';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import { SettingsComponent } from './settings/settings.component';
import { NavComponent } from './nav/nav.component';

import { ROUTES } from './app.routes';
import { SplashComponent } from './splash/splash.component';
import { UserComponent } from './user/user.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

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
    RouterModule.forRoot(ROUTES)
     AngularFireModule.initializeApp(environment.firebase, 'ConnecPlus'), 
    AngularFirestoreModule, 
    AngularFireAuthModule,
    auth features,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
