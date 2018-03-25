// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';

// import { MapComponent } from './map.component';
// import { DatabaseService } from '../services/database.service';
// import { ParticlesConfigService } from '../services/particles-config.service';
// import { LocationService } from '../services/location.service';
// import { User } from '../services/user';
// import { AuthService } from '../services/auth.service';
// import { AgmCoreModule, MapsAPILoader } from '@agm/core';

// import { FormsModule }   from '@angular/forms';
// let DatabaseServiceStub = {
// 	createUser(user: User){},
// 	updateUser(user: User){},
// 	getUser(uid: String){
// 		return new Promise((resolve, reject) => {
// 			resolve({});
// 		})
// 	},
// 	storeLocation(loc, uid): Promise<any>{
// 		return new Promise((resolve, reject) => {
// 			resolve({
// 				lat: 50,
// 				lon: 50
// 			})
// 		});
// 	},
// 	getNearbyUsers(uid: string): Promise<any>{
// 		return new Promise((resolve, reject) => {
// 			resolve([]);
// 		})
// 	},
// 	getTwitterFollowees(uid: String): Promise<any> {
// 		return new Promise((resolve, reject) => {
// 			resolve([]);
// 		});
// 	}
// }
// let TwitterServiceStub = {
// 	getFriends(screenName: string){}
// }
// let LocationServiceStub = {
// 	getLocation(): Promise<any>{
// 		return new Promise((resolve, reject) => {
// 			resolve({
// 				lon: 50,
// 				lat: 50
// 			})
// 		});
// 	}
// }
// let AuthServiceStub = {
// 	isAuthed(){
// 		return new Promise((resolve, reject) => {
// 			resolve(true);
// 		});
// 	},
// 	login(email, password){
// 		return new Promise((resolve, reject) => {
// 			resolve(true);
// 		});
// 	},
// 	logout(){
// 		return new Promise((resolve, reject) => {
// 			resolve(true);
// 		});
// 	},
// 	signup(email, password){
// 		return new Promise((resolve, reject) => {
// 			resolve(true);
// 		});  
// 	},
// 	resetpassowrd(email){
// 		return new Promise((resolve, reject) => {
// 			resolve(true);
// 		});
// 	},
// 	getUser(): Promise<any>{
// 		return new Promise((resolve, reject) => {
// 			resolve(true);
// 		})
// 	}
// }

// describe('MapComponent', () => {
//   let component: MapComponent;
//   let fixture: ComponentFixture<MapComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [ MapComponent ],
//       imports: [FormsModule, RouterTestingModule, AgmCoreModule.forRoot({apiKey: 'AIzaSyAYPFjyBz7atRsbr5GyJtlRiBLpu6hcD0A'})],
//       providers: [{provide: AuthService, useValue: AuthServiceStub},
// 				{provide: DatabaseService, useValue: DatabaseServiceStub},
// 				{provide: LocationService, useValue: LocationServiceStub},
// 				ParticlesConfigService, MapsAPILoader]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MapComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
