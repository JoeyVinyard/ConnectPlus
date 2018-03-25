import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { ClassesService } from '../services/classes.service';
import { DatabaseService } from '../services/database.service';
import { twitterService } from '../services/twitter.service';//LinkedInService
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

@Component({
	selector: 'app-create-profile',
	templateUrl: './create-profile.component.html',
	styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {
	model = {
		user: new User()
	}
	errors = {
		createError: "",
		fName:"",
		lName:"",
		ageE:"",
		genderE:""
	}

	particlesConfig;
	submitted = false;

	//Social Media Shows
	faceShow = false;
	twitShow = false;
	linkShow = false;
	blackShow = false;

	//Social Media Connected Vars
	inFacebook = false;
	inLinkedIn = false;
	inBlackboard = false;
	inTwitter = false;

	uid
	currSubject: String;
	subjects = [];
	classList = [];
	inSubject = false;
	inDelete = false;

	toggleDiv(name){
		if(name == "faceShow"){
			this.faceShow = !this.faceShow;
		}
		else if(name == "twitShow"){
			this.twitShow = !this.twitShow;
		}
		else if(name == "linkShow"){
			this.linkShow = !this.linkShow;
		}
		else if(name == "blackShow"){
			this.blackShow = !this.blackShow;
		}
	}

	url = '';
	onSelectFile(event) {
		if(event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]); // read file as data url
			reader.onload = (event:any) => { // called once readAsDataURL is completed
				this.model.user.url = event.target.result;
				console.log(this.model.user.url);
			}
		}
	}
	verifyThere(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if(!this.model.user.firstName)
			this.errors.fName = "Please enter your first name"
		if(!this.model.user.lastName)
			this.errors.lName = "Please enter your last name"
		if(!this.model.user.age)
			this.errors.ageE = "Please enter your age"
		if(!this.model.user.gender)
			this.errors.genderE = "Please select a gender"
		
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}
	verifyValid(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if(!(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.firstName))
			this.errors.fName = "Please provide a valid first name."
		if(!(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.lastName))
			this.errors.lName = "Please provide a valid last name."
		Object.keys(this.errors).forEach((key)=>{
			if(this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}
	submit(){
		if(this.verifyThere()){
			if(this.verifyValid()){
				this.model.user.fullName = this.model.user.firstName + " " + this.model.user.lastName;
				this.model.user.moodStatus = "Online";
				this.model.user.visibility = 100;
				this.auth.getUser().then((user) => {
					this.model.user.uid = user.uid;
					this.db.createUser(this.model.user).then((data) => {
						this.router.navigateByUrl('map');
					}).catch((err)=>{
						this.errors.createError = "profile creation failed"
						console.error(err);
					});
				})
			}else{
				this.errors.createError = "Wait a minute...Looks like you put in invalid information!"
			}
		}else{
			this.errors.createError = "Wait a minute...Looks like you forgot something!"
		}
	}
	link_twitter(){
		this.li.getFriends(this.model.user.screenName).then((data:any) => {
			console.log(this.model.user.uid);
			this.db.storeTwitterFollowees(data.users, this.model.user.screenName, this.model.user.uid).then((data) => {
				console.log(data);
			});
		}).catch((err) => {
			/*They inputted an invalid screen name if they get here*/
		});
	}
	login() {
		this.fb.login().then((res: LoginResponse) => {
			console.log('Logged in', res);
		}).catch(this.handleError);
	}
	link_facebook(){
		const loginOptions: LoginOptions = {
			enable_profile_selector: true,
			return_scopes: true,
			scope: 'public_profile,user_friends,email,pages_show_list,read_custom_friendlists'
		};
		console.log(this.returnLoginStatus());
		/*todo: Check if loggedin already */
		this.fb.getLoginStatus().then(res=>{
			if(res && res.status === 'unknown'){
				this.fb.login(loginOptions).then((res: LoginResponse) => {
					console.log('Logged in', res);
				}).then(() => {
					this.fb.api('/me/taggable_friends?limit=5000').then((res: any) => {
						console.log(this.model.user.uid);
						this.db.storeFacebookFriends(res.data,this.model.user.uid).then((data) => {
							console.log(data);
						}).catch((err)=>{
							this.errors.createError = "Facebook friends storage failed"
							console.error(err);
						})
						this.inFacebook = true;
					})
				}).catch(this.handleError);
			}else{
				console.log("Attempted to login when already logged in. We probably want to display an error message here");
			}
		});
		console.log(this.inFacebook);
	}
	logout_facebook(){
		this.fb.getLoginStatus()
		.then(res=>{
			if(res && res.status === 'connected'){
				console.log("Logging out")
				this.fb.logout()

				.then(res=>{console.log(res)})
				.catch(this.handleError);
				this.inFacebook = false;
			}
		}).catch(this.handleError);
		this.getLoginStatus();
	}
	returnLoginStatus(){
		this.fb.getLoginStatus().then(res=>{
			if(res && res.status === 'connected'){
				console.log(true);
				return true;
			}else{
				console.log(false);
				return false;
			}
		});
	}
	getLoginStatus() {
		this.fb.getLoginStatus()
		.then(console.log.bind(console))
		.catch(console.error.bind(console));
	}
	handleError(error) {
		console.error('Error processing action', error);
	}
	showClassList(subject: String){
		this.inSubject = true;
		this.currSubject = subject;
		this.cs.getClasses(subject).then((classes) => {
			this.classList = classes;
		}).catch((err) => {
			console.log(err);
		});
	}
	showSubjectList(){
		this.inSubject = false;
		this.classList = [];
	}
	toggleDelete(){
		this.inDelete = !this.inDelete;
		this.db.getClasses(this.uid).then((classes) => {
			this.classList = classes;
		}).catch((err) => {
			console.log(err);
		});
	}
	addClass(cl: String){
		this.db.addClass(this.uid, this.currSubject + " "  + cl).then((success) => {
			this.inSubject = false;
			this.classList = [];
			console.log("Added class:", success);
		}).catch((err) => {
			console.error(err);
		});
	}
	deleteClass(cl: String){
		this.classList.splice(this.classList.indexOf(cl), 1);
		this.db.deleteClass(this.uid, cl).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log(err);
		});
	}
	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private fb : FacebookService, private db: DatabaseService , private li: twitterService, private cs: ClassesService) {
	this.model.user.url = "../../assets/profileicon.ico";
	this.auth.isAuthed().then((user) => {
		console.log("Authed:",user);
	});
	this.auth.getUser().then((user) => {
		this.uid = user.uid;
	})
	this.cs.getSubjects().then((subjects) => {
		this.subjects = subjects;
	})
	fb.init({
		appId: '146089319399243',
		version: 'v2.12'
	});
}




	ngOnInit() {
	}

}

