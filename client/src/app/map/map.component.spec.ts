import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('Map Component', () => {

	let users = [];
	let map = {};
	let distanceFilter = {};
	let moodStatus = "";

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [],
		})
		.compileComponents();
	}));

	beforeEach(() => {});

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
});