import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { MapComponent } from './map/map.component';
import { SettingsComponent } from './settings/settings.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SplashComponent } from './splash/splash.component';
import { UserComponent } from './user/user.component';

import { AuthGuard } from './services/auth-guard.service';

export const ROUTES: Routes = [
	{
		path: "",
		component: SplashComponent
	},
	{
		path: "list",
		component: ListComponent,
		canActivate: [AuthGuard]
	},
	{
		path: "map",
		component: MapComponent,
		canActivate: [AuthGuard]
	},
	{
		path: "settings",
		component: SettingsComponent,
		canActivate: [AuthGuard]
	},
	{
		path: "signin",
		component: SigninComponent
	},
	{
		path: "signup",
		component: SignupComponent
	},
	{
		path: "user",
		component: UserComponent,
		canActivate: [AuthGuard]
	},
	{
		path: "user/:id",
		component: UserComponent,
		canActivate: [AuthGuard]
	}
];