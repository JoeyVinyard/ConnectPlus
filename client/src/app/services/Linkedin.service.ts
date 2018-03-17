import { Injectable } from '@angular/core';
import { User } from "./user";
//import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LinkedinService {

	constructor(private http: HttpClient) {}

	liurl = "https://api.twitter.com/1.1/friends/list.json"

	authToken = 'Bearer AAAAAAAAAAAAAAAAAAAAAISc4wAAAAAA89xdOU5AV7WPiKb89QHkWAQNlo8%3D0jlGGki2DkS2qiYexwwIwK11yylnz65A00c65v5lKNgospmaW4';
	results = {
		nextCursor : 0,
		users : []
	}
	httpOptions = {
			headers: new HttpHeaders({
			'Authorization':  this.authToken,
			}),
			params: new HttpParams()
	};
	// httpOptions = {
	// 	headers: new HttpHeaders({
	// 	'Authorization':  'Bearer AAAAAAAAAAAAAAAAAAAAAISc4wAAAAAA89xdOU5AV7WPiKb89QHkWAQNlo8%3D0jlGGki2DkS2qiYexwwIwK11yylnz65A00c65v5lKNgospmaW4',
	// 	})

	// };
	getFriends(screenName: string): Promise<any>{
		return new Promise((resolve, reject) => {
			this.httpOptions.params = this.httpOptions.params.append('cursor', '-1');
			this.httpOptions.params = this.httpOptions.params.append('skip_status', 'true');
			this.httpOptions.params = this.httpOptions.params.append('include_user_entities', 'false');
			this.httpOptions.params = this.httpOptions.params.append("screen_name", screenName);
			console.log(this.httpOptions);
			this.http.get("https://api.twitter.com/1.1/friends/list.json", this.httpOptions).subscribe((data:any) =>  {
				
				
				for(var user in data.users){
					
				}
				console.log(data.users);
				
				if(data){
					//console.log(data["users"].length());
					
				}
				
			});
		})
/*		let myHeaders = new Headers();
		myHeaders.append('Authorization', this.authToken);
		myHeaders.append('Host', 'api.twitter.com');
		myHeaders.append('Cache-Control', 'no-cache');
		let myParams = new URLSearchParams();
		myParams.append('cursor', '-1');
		myParams.append('screen_name', screenName);
		myParams.append('skip_status', 'true');
		myParams.append('include_user_entries', 'false');
		let options = new RequestOptions({ headers: myHeaders, params: myParams });
		console.log(options);
		return new Promise((resolve, reject) => {
			this.http.get(this.liurl,  options).subscribe((data) => {
				console.log(data);
				if(data)
					resolve(data["payload"]);
				else
					reject(data["err"]);
			});
		})*/
	}


}