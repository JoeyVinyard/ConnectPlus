import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ParticlesModule } from 'angular-particle';
import { FormsModule }   from '@angular/forms';


import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service'
import { User } from '../services/user';

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

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      providers: [{provide: AuthService, useValue: AuthServiceStub},
                      {provide: DatabaseService, useValue: DatabaseServiceStub},
                      ParticlesConfigService],
      imports: [RouterTestingModule, ParticlesModule, FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
