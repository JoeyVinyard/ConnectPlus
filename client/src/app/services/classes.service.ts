import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClassesService {

	getSubjects(): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("https://api.purdue.io/odata/Subjects").subscribe((data: any={}) => {
				resolve(data.value);
			})
		})
	}
	getClasses(sub: String): Promise<any>{
		return new Promise((resolve, reject) => {
			this.http.get("https://api.purdue.io/odata/Courses?$filter=Subject/Abbreviation eq '"+sub+"'&$orderby=Number asc").subscribe((data: any={}) => {
				resolve(data.value);
			})
		})
	}

	constructor(private http: HttpClient){

	}
}
