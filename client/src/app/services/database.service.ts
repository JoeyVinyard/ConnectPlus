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

	//Create user profile in firebase based on the User object. Returns a promise to the snapshot of the data posted, or an error message
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
	//Update user profile in firebase based on the User object. Returns promise to the snapshot of the data posted, or an error message
	updateUser(user: User): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.post("http://localhost:3000/updateUser", JSON.stringify(user), this.httpOptions).subscribe((data) => {
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	//Update user profile in firebase based on the User object. Returns a promise to the snapshot of the data that was deleted, or an error message
	deleteUser(user: User): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.delete("http://localhost:3000/deleteUser/"+user.uid, this.httpOptions).subscribe((data) => {
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	//Returns a promise to specific user based on the uid provided, or an error message.
	getUser(uid: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getUser/"+uid, this.httpOptions).subscribe((data) => {
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})
	}
	//Returns a promise to a list of users based on the uids provided, or an error message.
	getMultipleUsers(uids: String[]): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getUsers/"+uids.join("&"), this.httpOptions).subscribe((data) => {
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}
	//Returns a promsie to a list of all users, or an error message.
	getAllUsers(): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("http://localhost:3000/getAllUsers", this.httpOptions).subscribe((data) => {
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			})
		});
	}

	constructor(private http: HttpClient) {}

}
