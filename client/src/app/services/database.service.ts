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

	createUser(user: User): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.post("http://localhost:3000/createUser", JSON.stringify(user), this.httpOptions).subscribe((data) => {
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	updateUser(user: User){
		return new Promise((resolve, reject) => {
			this.http.post("http://localhost:3000/updateUser", JSON.stringify(user), this.httpOptions).subscribe((data) => {
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}

	constructor(private http: HttpClient) {}

}
