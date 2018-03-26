import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SettingsComponent } from './settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ParticlesModule } from 'angular-particle';
import { FormsModule }   from '@angular/forms';
import { twitterService } from '../services/twitter.service';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { ClassesService } from '../services/classes.service';

import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service'
import { User } from '../services/user';

let DatabaseServiceStub = {
  createUser(user: User){},
  updateUser(user: User){},
  getUser(uid: String){
    return new Promise((resolve, reject) => {
      resolve({});
    })
  },
}
let TwitterServiceStub = {
  getFriends(screenName: string){}
}
let ClassesServiceStub = {
  getClasses(subject: string):Promise<any>{
    return new Promise((resolve, reject) => {
      resolve([]);
    })
  },
  getSubjects(){
    return new Promise((resolve, reject) => {
      resolve([
        {
          Abbreviation: "AAE"
        },
        {
          Abbreviation: "AAR"
        },
        {
          Abbreviation: "AAA"
        },
        {
          Abbreviation: "AAD"
        }
      ]);
    })
  }
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
  },
  getUser(): Promise<any>{
    return new Promise((resolve, reject) => {
      resolve(true);
    })
  }
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      providers: [{provide: AuthService, useValue: AuthServiceStub},
                      {provide: DatabaseService, useValue: DatabaseServiceStub},
                      {provide: ClassesService, useValue: ClassesServiceStub},
                      {provide: twitterService, useValue: TwitterServiceStub},
                      ParticlesConfigService, FacebookService],
      imports: [RouterTestingModule, ParticlesModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load forms', () => {
    expect(fixture.debugElement.queryAll(By.css('form')).length).toEqual(4);
    });
});