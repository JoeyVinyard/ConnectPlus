import { Injectable } from '@angular/core';
import { User } from "./user";
//import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class twitterService {

	constructor(private http: HttpClient) {}

	liurl = "https://api.twitter.com/1.1/friends/list.json"

	authToken = 'Bearer AAAAAAAAAAAAAAAAAAAAAISc4wAAAAAA89xdOU5AV7WPiKb89QHkWAQNlo8%3D0jlGGki2DkS2qiYexwwIwK11yylnz65A00c65v5lKNgospmaW4';
	results = {
		nextCursor : '-1',
		users: []
	}
	httpOptions = {
		headers: new HttpHeaders({
			'Authorization':  this.authToken,
		}),
		params: new HttpParams()
	};
	
	getFriends(screenName: string): Promise<any>{
		return new Promise((resolve, reject) => {
			this.httpOptions.params = this.httpOptions.params.set("count", "200");
			this.httpOptions.params = this.httpOptions.params.set('cursor', this.results.nextCursor);
			this.httpOptions.params = this.httpOptions.params.set('skip_status', 'true');
			this.httpOptions.params = this.httpOptions.params.set('include_user_entities', 'false');
			this.httpOptions.params = this.httpOptions.params.set("screen_name", screenName);
			//console.log(this.httpOptions);
			this.http.get("https://api.twitter.com/1.1/friends/list.json", this.httpOptions).subscribe((data:any) =>  {
				console.log("data: ", data);
				if(data.next_cursor_str){
					this.results.nextCursor = data.next_cursor_str;
				}

				data.users.forEach((user:any) => {
					this.results.users.push(user.screen_name);
				});
			
				if(this.results.nextCursor != '0'){
					resolve(this.getFriends(screenName));
					
				}else{
					resolve(this.results);
				}
				
			}, (err) => {
				console.log(err);
				reject();
			});

		})
	}

}