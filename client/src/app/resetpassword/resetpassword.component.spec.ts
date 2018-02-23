import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordComponent } from './resetpassword.component';

import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';

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

describe('ResetpasswordComponent', () => {
  let component: ResetpasswordComponent;
  let fixture: ComponentFixture<ResetpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswordComponent ],
      imports: [ ParticlesModule, FormsModule ],
      providers: [ {provide: AuthService, useValue: AuthServiceStub},
                      ParticlesConfigService, AuthGuard ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
