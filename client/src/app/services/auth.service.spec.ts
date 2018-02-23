import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireModule } from 'angularfire2';

import { fbConfig } from '../../environments/firebase.config';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, AngularFireAuth],
      imports: [ AngularFireModule.initializeApp(fbConfig, 'ConnecPlus') ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
  it('should load isAuthed function', inject([AuthService], (service: AuthService) => {
    expect(service.isAuthed).toBeTruthy();
  }));
  it('should load login function', inject([AuthService], (service: AuthService) => {
    expect(service.login).toBeTruthy();
  }));
  it('should load signup function', inject([AuthService], (service: AuthService) => {
    expect(service.signup).toBeTruthy();
  }));
  it('should load logout function', inject([AuthService], (service: AuthService) => {
    expect(service.logout).toBeTruthy();
  }));
  it('should load getUser function', inject([AuthService], (service: AuthService) => {
    expect(service.getUser).toBeTruthy();
  }));
});
