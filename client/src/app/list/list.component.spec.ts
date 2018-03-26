import { async, ComponentFixture, TestBed } from '@angular/core/testing';''

import { ListComponent } from './list.component';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';

let DatabaseServiceStub = {
	createUser(user: User){},
	updateUser(user: User){},
	getUser(uid: String){
		return new Promise((resolve, reject) => {
			resolve({});
		})
	},
	storeLocation(loc, uid): Promise<any>{
		return new Promise((resolve, reject) => {
			resolve({
				lat: 50,
				lon: 50
			})
		});
	},
	getNearbyUsers(uid: string): Promise<any>{
		return new Promise((resolve, reject) => {
			resolve([]);
		})
	}
}
let TwitterServiceStub = {
	getFriends(screenName: string){}
}
let LocationServiceStub = {
	getLocation(): Promise<any>{
		return new Promise((resolve, reject) => {
			resolve({
				lon: 50,
				lat: 50
			})
		});
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

describe('ListComponent', () => {
	let component: ListComponent;
	let fixture: ComponentFixture<ListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ListComponent ],
			imports: [ FormsModule, RouterTestingModule ],
			providers: [ {provide: AuthService, useValue: AuthServiceStub},
						{provide: DatabaseService, useValue: DatabaseServiceStub},
						{provide: LocationService, useValue: LocationServiceStub},
						ParticlesConfigService]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
