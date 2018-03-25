import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SplashComponent } from './splash.component';

import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { fbConfig } from '../../environments/firebase.config';

import { ParticlesModule } from 'angular-particle';

describe('SplashComponent', () => {
  let component: SplashComponent;
  let fixture: ComponentFixture<SplashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashComponent ],
      imports: [ ParticlesModule, AngularFireModule.initializeApp(fbConfig, 'ConnecPlus')],
      providers: [ AuthService, AuthGuard, ParticlesConfigService, AngularFireAuth ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load particles', () => {
    expect(fixture.debugElement.query(By.css("particles"))).toBeTruthy();
    expect(component.pConfig).toBeTruthy();
    expect(component.pConfig.height).toBeTruthy();
    expect(component.pConfig.width).toBeTruthy();
    expect(component.pConfig.params).toBeTruthy();
    expect(component.pConfig.style).toBeTruthy();
  });
  it('should load signup buttons', () => {
    var l = fixture.debugElement.queryAll(By.css("button")).filter((button) => button.attributes.routerLink == "/signup");
    expect(l.length).toEqual(2);
  });
  it('should load signin buttons', () => {
    var l = fixture.debugElement.queryAll(By.css("button")).filter((button) => button.attributes.routerLink == "/signin");
    expect(l.length).toEqual(2);
  });
  it('should load social media icons', () => {
    var l = fixture.debugElement.queryAll(By.css(".social-icon-button"))
    expect(l.length).toEqual(11);
  });
  it('should load title', () => {
    expect(fixture.debugElement.query(By.css("#firstTitle"))).toBeDefined();
  })
});
