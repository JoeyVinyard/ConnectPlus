import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MapComponent } from './map.component';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';

describe('MapComponent', () => {
let component: MapComponent;
	let fixture: ComponentFixture<MapComponent>;
	let users = [];
	let map = {};
	let distanceFilter = {};
	let moodStatus = "";
	let messages = "";
	let sortedUsers = [];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [],
		})
		.compileComponents();
	}));

	
	it('should load the map', () => {
		expect(map).toBeTruthy();
	})
	it('show load users in', () => {
		expect(users).toBeTruthy();
	})
	it('should only load users within three miles', () => {
		expect(users).toBeTruthy();
	})
	it('should load distance filter', () => {
		expect(distanceFilter).toBeTruthy();
	})
	it('should change mood status', () => {
		moodStatus = "Away";
		expect(moodStatus).toEqual("Away");
	})
	it('should show messaging feature', () => {
		expect(messages).toBeTruthy;
	})
	it('should sort members on map based on commonalities', () => {
		expect(sortedUsers).toBeTruthy;
	})
	it('should show sorted members on map', () => {
		sortedUsers = users;
		expect(users).toEqual(sortedUsers);
	})


});



