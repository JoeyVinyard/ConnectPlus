import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { ClassesService } from '../services/classes.service';
import { DatabaseService } from '../services/database.service';
import { twitterService } from '../services/twitter.service';//LinkedInService
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { interestsList } from '../services/interests.service';

@Component({
	selector: 'app-create-profile',
	templateUrl: './create-profile.component.html',
	styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {
	model = {
		user: new User(),
		interestSub: "",
		interestSelected: ""
	}
	errors = {
		createError: "",
		fName: "",
		lName: "",
		ageE: "",
		genderE: "",
		twitterE: ""
	}

	particlesConfig;
	submitted = false;

	//Social Media Shows
	faceShow = false;
	twitShow = false;
	youShow = false;
	blackShow = false;

	//Social Media Connected Vars
	inFacebook = false;
	inYoutube = false;
	inBlackboard = false;
	inTwitter = false;

	uid
	currSubject: String;
	subjects = [];
	classList = [];
	userClasses = [];
	inSubject = false;
	inDelete = false;
	inAdd = false;
	blackInter = false;

	interestObj = new interestsList()
	// cInterest = this.model.interest;
	cIntArray = [];

	toggleDiv(name) {
		if (name == "faceShow") {
			this.faceShow = !this.faceShow;
		}
		else if (name == "twitShow") {
			this.twitShow = !this.twitShow;
		}
		else if(name == "youShow"){
			this.youShow = !this.youShow;
		}
		else if (name == "blackShow") {
			this.blackShow = !this.blackShow;
		}
	}

	url = '';
	onSelectFile(event) {
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]); // read file as data url
			reader.onload = (event: any) => { // called once readAsDataURL is completed
				this.model.user.url = event.target.result;
				console.log(this.model.user.url);
			}
		}
	}
	verifyThere() {
		Object.keys(this.errors).forEach((key) => {
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if (!this.model.user.firstName)
			this.errors.fName = "Please enter your first name"
		if (!this.model.user.lastName)
			this.errors.lName = "Please enter your last name"
		if (!this.model.user.age)
			this.errors.ageE = "Please enter your age"
		else if (this.model.user.age < 0)
			this.errors.ageE = "Unfortunately, time travel is not possible yet."
		if (!this.model.user.gender)
			this.errors.genderE = "Please select a gender"

		Object.keys(this.errors).forEach((key) => {
			if (this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}
	verifyValid() {
		Object.keys(this.errors).forEach((key) => {
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if (!(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.firstName))
			this.errors.fName = "Please provide a valid first name."
		if (!(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.lastName))
			this.errors.lName = "Please provide a valid last name."
		Object.keys(this.errors).forEach((key) => {
			if (this.errors[key])
				noErr = false;
		})
		// console.log(this.errors, noErr);
		return noErr;
	}
	submit() {
		if (this.verifyThere()) {
			if (this.verifyValid()) {
				this.model.user.fullName = this.model.user.firstName + " " + this.model.user.lastName;
				this.model.user.moodStatus = "Online";
				this.model.user.visibility = 100;
				this.auth.getUser().then((user) => {
					this.model.user.uid = user.uid;
					this.db.createUser(this.model.user).then((data) => {
						this.router.navigateByUrl('map');
					}).catch((err) => {
						this.errors.createError = "profile creation failed"
						console.error(err);
					});
				})
			} else {
				this.errors.createError = "Wait a minute...Looks like you put in invalid information!"
			}
		} else {
			this.errors.createError = "Wait a minute...Looks like you forgot something!"
		}
	}
	link_twitter() {
		this.li.getFriends(this.model.user.screenName).then((data: any) => {
			console.log(this.model.user.uid);
			this.db.storeTwitterFollowees(data.users, this.model.user.screenName, this.model.user.uid).then((data) => {
				console.log(data);
			});
		}).catch((err) => {
			this.errors.twitterE = "you were not able to connect to twitter"

			/*They inputted an invalid screen name if they get here*/
		});
	}
	login() {
		this.fb.login().then((res: LoginResponse) => {
			console.log('Logged in', res);
		}).catch(this.handleError);
	}
	link_facebook() {
		const loginOptions: LoginOptions = {
			enable_profile_selector: true,
			return_scopes: true,
			scope: 'public_profile,user_friends,email,pages_show_list,read_custom_friendlists'
		};
		console.log(this.returnLoginStatus());
		/*todo: Check if loggedin already */
		this.fb.getLoginStatus().then(res => {
			if (res && res.status === 'unknown') {
				this.fb.login(loginOptions).then((res: LoginResponse) => {
					console.log('Logged in', res);
				}).then(() => {
					this.fb.api('/me/taggable_friends?limit=5000').then((res: any) => {
						console.log(this.model.user.uid);
						this.db.storeFacebookFriends(res.data, this.model.user.uid).then((data) => {
							console.log(data);
						}).catch((err) => {
							this.errors.createError = "Facebook friends storage failed"
							console.error(err);
						})
						this.inFacebook = true;
					})
				}).catch(this.handleError);
			} else {
				console.log("Attempted to login when already logged in. We probably want to display an error message here");
			}
		});
		console.log(this.inFacebook);
	}
	logout_facebook() {
		this.fb.getLoginStatus()
			.then(res => {
				if (res && res.status === 'connected') {
					console.log("Logging out")
					this.fb.logout()

						.then(res => { console.log(res) })
						.catch(this.handleError);
					this.inFacebook = false;
				}
			}).catch(this.handleError);
		this.getLoginStatus();
	}
	returnLoginStatus() {
		this.fb.getLoginStatus().then(res => {
			if (res && res.status === 'connected') {
				console.log(true);
				return true;
			} else {
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
	showClassList(subject: String) {
		this.inSubject = true;
		this.currSubject = subject;
		this.cs.getClasses(subject).then((classes) => {
			this.classList = classes;
		}).catch((err) => {
			console.log(err);
		});
	}
	showSubjectList() {
		this.inSubject = false;
		this.classList = [];
	}
	toggleDelete() {
		if (this.inDelete) { //currently true
			this.inDelete = false;
			this.blackInter = false;
		}
		else { //currently false
			this.inDelete = true;
			this.blackInter = true;
			if (this.inAdd) {
				this.inAdd = false;
			}

			this.db.getClasses(this.model.user.uid).then((classes) => {
				this.classList = classes;
			}).catch((err) => {
				console.log(err);
			})
		}
	}

	toggleAdd() {
		if (this.inAdd) { //currently true
			this.inAdd = false;
			this.blackInter = false;
		}
		else { //currently false
			this.inAdd = true;
			this.blackInter = true;
			if (this.inDelete) {
				this.inDelete = false;
			}
		}
	}
	addClass(cl: String) {
		this.db.addClass(this.model.user.uid, this.currSubject + " " + cl).then((success) => {
			this.inSubject = false;
			this.classList = [];
			console.log("Added class:", success);

			this.updateClasses();
		}).catch((err) => {
			console.log(err);
		})
	}
	deleteClass(cl: String) {
		this.userClasses.splice(this.userClasses.indexOf(cl), 1);
		this.db.deleteClass(this.model.user.uid, cl).then((data) => {
			console.log(data);

			this.updateClasses();
		}).catch((err) => {
			console.log(err);
		})
	}

	updateClasses() {
		this.db.getClasses(this.model.user.uid).then((classes) => {
			this.classList = classes;
			this.userClasses = classes;
			console.log(this.userClasses);
		}).catch((err) => {
			console.log(err);
		})
	}

	updateIntArray() {
		console.log("Interests Updated");
		console.log(this.model.interestSub);
		if (this.model.interestSub == "Country") {
			this.cIntArray = this.country;
		}
		else if (this.model.interestSub == "Movies") {
			this.cIntArray = this.movies;
		}
		else if (this.model.interestSub == "Animals") {
			this.cIntArray = this.animals;
		}
		else if (this.model.interestSub == "Hobbies") {
			this.cIntArray = this.hobbies;
		}
		else if (this.model.interestSub == "Tv") {
			this.cIntArray = this.tvShows;
		}
		else if (this.model.interestSub == "Sports") {
			this.cIntArray = this.sports;
		}
		else if (this.model.interestSub == "Music") {
			this.cIntArray = this.musicGenre;
		}

	}

	country: string[] = this.interestObj.country;
	movies: string[] = this.interestObj.movieGenre;
	animals: string[] = this.interestObj.animal;
	hobbies: string[] = this.interestObj.hobbies;
	tvShows: string[] = this.interestObj.tvShows;
	sports: string[] = this.interestObj.sports;
	musicGenre: string[] = this.interestObj.musicGenre;
	interestList;
	arrayOfInterestKeys: string[];
	interestSubArray: string[];
	arraytemp: string[];

	subtemp: String;
	intertemp: String;

	addInterest(sub: String, inter: String){
		console.log(sub + " " + inter);
		this.model.interestSelected = "";
		this.db.addInterest(this.model.user.uid, sub , inter).then((success) => {
				this.model.interestSelected = ""

			//this.interestList = [];
			console.log("why")
			this.updateInterest();
		}).catch((err) => {
			console.log(err);
		})
	}
	deleteInterest(sub: String, inter: String){
		this.db.deleteInterest(this.model.user.uid, sub , inter).then((data) => {
			console.log("hi there");
			this.updateInterest();
		}).catch((err) => {
			console.log(err);
		})
	}
	clearAllCatInterests(sub: string){
		console.log("not printing", sub);
		// this.db.clearAllCatInterests(this.model.user.uid, sub).then((data) => {
		// 	console.log("hi there");
		// 	this.updateInterest();
		// }).catch((err) => {
		// 	console.log(err);
		// })
		this.arraytemp = this.getArrayInter(sub);
		this.arraytemp.forEach((inter) => {
					this.deleteInterest(sub, inter);

				});
	}

	updateInterest(){
		this.db.getInterests(this.model.user.uid).then((interests) => {
			this.interestList = interests;
			console.log("in update")
			console.log(interests)
			this.arrayOfInterestKeys = Object.keys(this.interestList);
			console.log(this.arrayOfInterestKeys)
			//this.getArrayOfInterestKeys();
			
		}).catch((err) => {
			console.log(err);
		})
	}
	getArrayInter(sub:string):string[]{

		this.interestSubArray = Object.values(this.interestList[sub]);
		return this.interestSubArray;


	}
	getArrayOfInterestKeys():string[]{

		this.arrayOfInterestKeys = Object.keys(this.interestList);
		return this.arrayOfInterestKeys;

	}


	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private fb: FacebookService, private db: DatabaseService, private li: twitterService, private cs: ClassesService) {
		this.model.user.url = "../../assets/profileicon.ico";
		this.auth.isAuthed().then((user) => {
			console.log("Authed:", user);
		});
		this.auth.getUser().then((user) => {
			this.uid = user.uid;

			this.updateClasses();
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

