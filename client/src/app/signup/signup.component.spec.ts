import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SignupComponent } from './signup.component';

import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { DatabaseService } from '../services/database.service';
import { User } from '../services/user';
import { AngularFireAuth } from 'angularfire2/auth'

import { RouterTestingModule } from '@angular/router/testing';
import { ParticlesModule } from 'angular-particle';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { fbConfig } from '../../environments/firebase.config';


let DatabaseServiceStub = {
  createUser(user: User){},
  updateUser(user: User){}
}

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

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [ ParticlesModule, FormsModule, RouterTestingModule, AngularFireModule.initializeApp(fbConfig, 'ConnecPlus') ],
      providers: [ {provide: AuthService, useValue: AuthServiceStub},
                      {provide: AuthGuard, useValue: AuthGuardStub},
                      {provide: DatabaseService, useValue: DatabaseServiceStub}
                      , AngularFireAuth, ParticlesConfigService ]
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
  it('should load fields', () => {
    expect(fixture.debugElement.queryAll(By.css(".form-group")).length).toEqual(3);
    expect(fixture.debugElement.queryAll(By.css("label")).length).toEqual(3);
    expect(fixture.debugElement.queryAll(By.css("input")).length).toEqual(3);
  });
  it('should check if email entered', () => {
    var expectedError = "Please provide a valid email.";
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#emailError")).nativeElement.innerText).toEqual(expectedError);
  });
  it('should check if email is valid', () => {
    var expectedError = "";
    component.model.user.email="vinyardjoseph@gmail.com"
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#emailError")).nativeElement.innerText).toEqual(expectedError);
    var expectedError = "Please provide a valid email.";
    component.model.user.email="@gmail.com"
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#emailError")).nativeElement.innerText).toEqual(expectedError);
    var expectedError = "Please provide a valid email.";
    component.model.user.email="sdfghjkl"
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#emailError")).nativeElement.innerText).toEqual(expectedError);
  });
  it('should check if password is entered', () => {
    var expectedError = "Please enter your password.";
    component.model.password = "";
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#passError")).nativeElement.innerText).toEqual(expectedError);
    var expectedError = "";
    component.model.password = "asdfasdf";
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#passError")).nativeElement.innerText).toEqual(expectedError);
  })
  it('should check if password confirmation is entered', () => {
    var expectedError = "Please confirm your password.";
    component.model.confpass = "";
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#confError")).nativeElement.innerText).toEqual(expectedError);
    var expectedError = "";
    component.model.confpass = "asdfasdf";
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#confError")).nativeElement.innerText).toEqual(expectedError);
  })
  it('should check if passwords match', () => {
    var expectedError = "Passwords must match!";
    component.model.password = "asdfasdf";
    component.model.confpass = "asdf";
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#confError")).nativeElement.innerText).toEqual(expectedError);
    var expectedError = "";
    component.model.password = "pancakes";
    component.model.confpass = "pancakes";
    component.submit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#confError")).nativeElement.innerText).toEqual(expectedError);
  })
});
