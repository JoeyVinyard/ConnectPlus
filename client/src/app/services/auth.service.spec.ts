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
  it('should load auth functions', inject([AuthService], (service: AuthService) => {
  	expect(service.isAuthed).toBeTruthy();
  	expect(service.login).toBeTruthy();
  	expect(service.signup).toBeTruthy();
  	expect(service.logout).toBeTruthy();
  }));
});
