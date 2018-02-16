import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


import { SigninComponent } from './signin.component';

import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AngularFireAuth } from 'angularfire2/auth'

import { ParticlesModule } from 'angular-particle';
import { FormsModule }   from '@angular/forms';

let AuthServiceStub = {
  isAuthed(){
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  },
  login(email, password){
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  },
  logout(){
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  },
  signup(email, password){
    return new Promise((resolve, reject) => {
      resolve(true);
    });  
  },
  resetpassowrd(email){
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

let AuthGuardStub = {
  canActivate(){
    return new Promise((resolve, reject) => {
      resolve(true);
    })
  }
}

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninComponent ],
      imports: [ ParticlesModule, FormsModule ],
     providers: [ {provide: AuthService, useValue: AuthServiceStub},
                      {provide: AuthGuard, useValue: AuthGuardStub}
                      , AngularFireAuth, ParticlesConfigService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load fields', () => {
    expect(fixture.debugElement.queryAll(By.css(".form-group")).length).toEqual(2);
    expect(fixture.debugElement.queryAll(By.css("font")).length).toEqual(2);
    expect(fixture.debugElement.queryAll(By.css("input")).length).toEqual(2);
  });
});
