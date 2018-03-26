import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { NavComponent } from './nav.component';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { fbConfig } from '../../environments/firebase.config';

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

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports: [RouterTestingModule, AngularFireModule.initializeApp(fbConfig, 'ConnecPlus')],
      providers: [{provide: AuthService, useValue: AuthServiceStub},
                    AngularFireAuth]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load logo', () => {
    expect(fixture.debugElement.query(By.css('#navLogo'))).toBeTruthy();
  });
  it('should load navbar', () => {
    expect(fixture.debugElement.query(By.css('.dropdown'))).toBeTruthy();
  })

});