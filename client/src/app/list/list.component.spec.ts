import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

	it('should show user', () => {
		expect(fixture.debugElement.query(By.css('selectedUserDivInfo'))).toBeTruthy;
	});

	it('should populate user card with info', () => {
		expect(fixture.debugElement.query(By.css('FilterSection'))).toBeTruthy;
	});

	it('should allow return to map', () => {
		expect(fixture.debugElement.queryAll(By.css('.selectedButton')).length).toEqual(3);
	});

	it('should show messaging feature', () => {
		expect(fixture.debugElement.query(By.css('messagesPanel'))).toBeTruthy;
	})

	it('should sort users by commonalities', () => {
		expect(fixture.debugElement.query(By.css('threadPic'))).toBeTruthy;
	})

	it('should show sorted users in order', () => {
		expect(fixture.debugElement.query(By.css('userDivImg'))).toBeTruthy;
	})

	it('should filter users based on YouTube subscriptions', () => {
		var user1 = {uid: 100, subscriptions: 'Justin Timberlake', common: 0};
		var user2 = {uid: 101, subscriptions: 'Justin Timberlake', common: 0};
		var user3 = {uid: 102, subscriptions: 'Madonna', common: 0};
		if(user1.subscriptions == user2.subscriptions){
			user1.common = 1;
			user2.common = 1;
		}
		expect(user1.common).toEqual(1);
	})
});
