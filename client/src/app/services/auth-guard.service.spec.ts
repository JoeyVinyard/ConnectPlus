import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireModule } from 'angularfire2';

import { fbConfig } from '../../environments/firebase.config';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, AuthService, AngularFireAuth],
      imports: [ AngularFireModule.initializeApp(fbConfig, 'ConnecPlus') ]
    });
  });

  it('should be created', inject([AuthGuard], (service: AuthGuard) => {
    expect(service).toBeTruthy();
  }));
});
