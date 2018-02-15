import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplashComponent } from './splash.component';

import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';

import { ParticlesModule } from 'angular-particle';

describe('SplashComponent', () => {
  let component: SplashComponent;
  let fixture: ComponentFixture<SplashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashComponent ],
      imports: [ ParticlesModule ],
      providers: [ AuthService, AuthGuard, ParticlesConfigService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });

});
