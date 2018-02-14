import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(): Promise<any> {
		return this.auth.isAuthed().then((authed) => {
			return authed || !environment.production;
		});
	}
	constructor(private auth: AuthService){}
}