import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CreateProfileComponent } from './create-profile.component';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from "../services/user";

import { ClassesService } from '../services/classes.service';
import { DatabaseService } from '../services/database.service';
import { twitterService } from '../services/twitter.service';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

import { ParticlesModule } from 'angular-particle';
import { FormsModule }   from '@angular/forms';

let DatabaseServiceStub = {
	createUser(user: User){},
	updateUser(user: User){},
	getUser(uid: String){
		return new Promise((resolve, reject) => {
			resolve({});
		})
	},
	getClasses(uid: String): Promise<any>{
		return new Promise((resolve, reject) => {
			resolve([]);
		})
	},
	addClass(uid: String, cl:String): Promise<any>{
		return new Promise((resolve, reject) => {
			resolve({});
		})
	},
	deleteClass(uid: String, cl: String): Promise<any>{
		return new Promise((resolve, reject) => {
			resolve({});
		})
	}
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

describe('CreateProfileComponent', () => {
	let component: CreateProfileComponent;
	let fixture: ComponentFixture<CreateProfileComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ CreateProfileComponent ],
			imports: [ FormsModule, ParticlesModule, RouterTestingModule ],
			providers: [ {provide: AuthService, useValue: AuthServiceStub},
						{provide: DatabaseService, useValue: DatabaseServiceStub},
						{provide: ClassesService, useValue: ClassesServiceStub},
						{provide: twitterService, useValue: TwitterServiceStub}
						, ParticlesConfigService, FacebookService ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should load form labels', () => {
		expect(fixture.debugElement.queryAll(By.css('#formTitle')).length).toEqual(4);
	});
	it('should load all inputs', () => {
		expect(fixture.debugElement.queryAll(By.css('input')).length).toEqual(34);
	});
	it('should load load submit button', () => {
		expect(fixture.debugElement.queryAll(By.css('button')).length).toEqual(2);
	});
	it('should load social media icons', () => {
		expect(fixture.debugElement.queryAll(By.css('.social-icon-button')).length).toEqual(4);
	})
});
