import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { MapComponent } from './map/map.component';
import { SettingsComponent } from './settings/settings.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SplashComponent } from './splash/splash.component';
import { UserComponent } from './user/user.component';

export const ROUTES: Routes = [
	{
		path: "",
		component: SplashComponent
	},
	{
		path: "list",
		component: ListComponent
	},
	{
		path: "map",
		component: MapComponent
	},
	{
		path: "settings",
		component: SettingsComponent
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
		component: UserComponent
	},
	{
		path: "user/:id",
		component: UserComponent
	}
];