import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DatabaseService {

	dbUrl = "http://localhost:3000";

	httpOptions = {
		headers: new HttpHeaders({
		'Content-Type':  'application/x-www-form-urlencoded',
		})
	};

	createUser(user: User){
		// var tempUser = {
		// 	firstName: "Joey",
		// 	lastName: "Vinyard",
		// 	age: 19,
		// 	interests: [
		// 		"Rock Climbing",
		// 		"Video Games",
		// 		"Airplanes",
		// 		"Sexual things",
		// 		"Men"
		// 	]
		// }
		this.http.post("http://localhost:3000/create", JSON.stringify(user), this.httpOptions).subscribe();
	}

	constructor(private http: HttpClient) {}

}
