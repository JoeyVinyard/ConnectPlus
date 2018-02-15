import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';

import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AngularFireAuth } from 'angularfire2/auth'

import { ParticlesModule } from 'angular-particle';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';

import { fbConfig } from '../../environments/firebase.config';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [ ParticlesModule, FormsModule, AngularFireModule.initializeApp(fbConfig, 'ConnecPlus') ],
      providers: [ AuthService, AuthGuard, AngularFireAuth, ParticlesConfigService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
