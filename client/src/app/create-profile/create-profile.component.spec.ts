import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CreateProfileComponent } from './create-profile.component';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from "../services/user";
import { DatabaseService } from '../services/database.service';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

import { ParticlesModule } from 'angular-particle';
import { FormsModule }   from '@angular/forms';

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

describe('CreateProfileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProfileComponent ],
      imports: [ FormsModule, ParticlesModule, RouterTestingModule ],
      providers: [ {provide: AuthService, useValue: AuthServiceStub},
                      {provide: DatabaseService, useValue: DatabaseServiceStub}
                      , ParticlesConfigService, FacebookService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load form', () => {
    expect(fixture.debugElement.query(By.css('form'))).toBeTruthy();
  });
  it('should load all inputs', () => {
    expect(fixture.debugElement.queryAll(By.css('input')).length).toEqual(33);
  });
  it('should load load submit button', () => {
    expect(fixture.debugElement.queryAll(By.css('button')).length).toEqual(2);
  })
});
