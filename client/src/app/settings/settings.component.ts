import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticlesConfigService } from '../services/particles-config.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { ClassesService } from '../services/classes.service';
import { User } from '../services/user';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
import { twitterService } from '../services/twitter.service';
import { interestsList } from '../services/interests.service';
@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	errors = {
		//change info errors
		changeInfoE: "",
		FnameError: "",
		LnameError: "",
		AgeError: "",
		//change email errors
		emailChangeE: "",
		currentEmailChange: "",
		newEmail: "",
		currentEmail: "",
		//change password errors
		passwordChangeE: "",
		newPass: "",
		oldPass: "",
		conPass: "",
		//delete user
		email: "",
		pass: "",
		cred: "",
		//twitter error
		twitterE: "",
		feedbackE: ""
	}
	success = {
		//change email success
		emailChangeS: "",
		//change password success
		passwordChangeS: "",
		//change info success
		changeInfoS: "",
		//feedback
		feedbackS: ""
	}
	model = {
		user: new User(),
		//del user var
		password: "",
		email: "",
		//change email vars
		currentEmail: "",
		newEmail: "",
		emailChangePass: "",
		//change password vars
		currentPassword: "",
		newPassword: "",
		conPassword: "",
		//feedback
		feedback: "",
		interestSub: "",
		interestSelected: ""

	}

	interestObj = new interestsList()
	// cInterest = this.model.interest;
	cIntArray = [];

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
		else if (this.model.interestSub == "Dance") {
			this.cIntArray = this.dance;
		}
		else if (this.model.interestSub == "Foods") {
			this.cIntArray = this.foods;
		}
		else if (this.model.interestSub == "Languages") {
			this.cIntArray = this.languages;
		}
		else if (this.model.interestSub == "Artists") {
			this.cIntArray = this.FavoriteArtists;
		}
		else if (this.model.interestSub == "Majors") {
			this.cIntArray = this.majors;
		}


	}

	country: string[] = this.interestObj.country;
	movies: string[] = this.interestObj.movieGenre;
	animals: string[] = this.interestObj.animal;
	hobbies: string[] = this.interestObj.hobbies;
	tvShows: string[] = this.interestObj.tvShows;
	sports: string[] = this.interestObj.sports;
	musicGenre: string[] = this.interestObj.musicGenre;
dance: string[] = this.interestObj.dance;
foods: string[] = this.interestObj.foods;
languages: string[] = this.interestObj.languages;
FavoriteArtists: string[] = this.interestObj.FavoriteArtists;
majors: string[] = this.interestObj.majors;






	allMap;
	interestList;
	arrayOfInterestKeys: string[];
	interestSubArray: string[];
	arraytemp: string[];

	subtemp: String;
	intertemp: String;


	particlesConfig;
	submitted = false;
	//Div Visibility Vars
	invShow = false;
	genShow = false;
	secShow = false;
	conShow = false;
	intShow = false;
	fedShow = false;
	delShow = false;

	faceShow = false;
	twitShow = false;
	youShow = false;
	blackShow = false;

	//Social Media Connected Vars
	inFacebook = false;
	inYoutube = false;
	inBlackboard = false;
	inTwitter = false;

	//Invisibility Toggle 0=Invisible, 4hour, 12hour, 24hour, 100=Visible
	visibility = 0;
	// visibility = this.model.user.visability;
	currSubject: String;
	subjects = [];
	classList = [];
	userClasses = [];
	inSubject = false;
	inDelete = false;
	inAdd = false;
	blackInter = false;
	url;

	onSelectFile(event) {
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]); // read file as data url
			reader.onload = (event: any) => { // called once readAsDataURL is completed
				// this.url = event.target.result;
				this.model.user.url = event.target.result;
				//this.updateInfo();
				console.log(this.model.user.url);
			}
		}
	}



	toggleDiv(name) {

		if (name == "invShow") {
			this.invShow = !this.invShow;
		}
		else if (name == "genShow") {
			this.genShow = !this.genShow;
		}
		else if (name == "secShow") {
			this.secShow = !this.secShow;
		}
		else if (name == "conShow") {
			this.conShow = !this.conShow;
		}
		else if (name == "intShow") {
			this.intShow = !this.intShow;
		}
		else if (name == "fedShow") {
			this.fedShow = !this.fedShow;
		}
		else if (name == "delShow") {
			this.delShow = !this.delShow;
		}
		else if (name == "faceShow") {
			this.faceShow = !this.faceShow;
		}
		else if (name == "twitShow") {
			this.twitShow = !this.twitShow;
		}
		else if (name == "youShow") {
			this.youShow = !this.youShow;
		}
		else if (name == "blackShow") {
			this.blackShow = !this.blackShow;
		}
		this.clearing();
	}
	setVisible(number) {
		this.visibility = number;
		//this.model.user.visability = number;
	}
	clearing() {
		this.errors.email = "";
		this.errors.pass = "";
		this.errors.newEmail = "";
		this.errors.currentEmail = "";
		this.errors.newPass = "";
		this.errors.oldPass = "";
		this.errors.conPass = "";
		this.errors.cred = "";
		this.errors.passwordChangeE = "";
		this.success.passwordChangeS = "";
		this.errors.emailChangeE = "";
		this.errors.emailChangeE = "";
		this.errors.changeInfoE = "";
		this.success.changeInfoS = "";
		this.errors.FnameError = "";
		this.errors.LnameError = "";
		this.errors.twitterE = "";
		this.model.user.screenName = "";
		this.success.feedbackS = "";
		this.errors.feedbackE = "";
		this.errors.AgeError = "";
		this.model.interestSub = "";
		this.model.interestSelected = "";

		this.auth.getUser().then((user) => {
			this.model.user.uid = user.uid;
			this.model.user.firstName = user.firstName;
			this.db.getUser(user.uid).then((userData) => {
				this.model.user = userData
			})
		});
	}
	verifyValid() {
		Object.keys(this.errors).forEach((key) => {
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if (!this.model.user.firstName || !(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.firstName))
			this.errors.FnameError = "Please provide a valid first name."
		if (!this.model.user.lastName || !(new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")).exec(this.model.user.lastName))
			this.errors.LnameError = "Please provide a valid last name."
		if (!this.model.user.age)
			this.errors.AgeError = "Please enter your age";
		else if (this.model.user.age < 0)
			this.errors.AgeError = "Unfortunately, time travel is not possible yet.";
		Object.keys(this.errors).forEach((key) => {
			if (this.errors[key])
				noErr = false;
		})

		// console.log(this.errors, noErr);
		return noErr;
	}
	updateInfo() {
		console.log(this.model);
		if (this.verifyValid()) {
			this.model.user.fullName = this.model.user.firstName + " " + this.model.user.lastName;
			this.auth.getUser().then((user) => {
				this.db.updateUser(this.model.user).then((data) => {
					console.log(data);
					this.success.changeInfoS = "Your information has been updated!"
				}).catch((err) => {
					console.error(err);
					this.errors.changeInfoE = "Your information has NOT been updated!"
				})
				this.success.changeInfoS = "Your information has been updated!"
			});
		}
		else {
			this.errors.changeInfoE = "Looks like you tried to change your information to something invalid. \nYour information has NOT been updated!"
		}
	}


	feedback() {
		if (this.model.feedback) {
			//not storing it anywhere
			this.success.feedbackS = "Thank you for your feedback. It has been sent to our developers."		
			this.model.feedback = "";
		}
	}

	verifyEmail() {
		Object.keys(this.errors).forEach((key) => {
			this.errors[key] = null;
		})
		var noErr = true;
		//Sanitize input here
		if (!this.model.newEmail || !(new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+")).exec(this.model.newEmail)) {
			this.errors.newEmail = "Please provide a valid email.";
		}
		else if (this.model.newEmail == this.model.currentEmail)
			this.errors.newEmail = "Please provide differnt email.";

		Object.keys(this.errors).forEach((key) => {
			if (this.errors[key])
				noErr = false;
		})
		return noErr;
	}

	changeemail() {
		this.success.emailChangeS = "";
		console.log(this.model);
		if (this.verifyEmail()) {
			this.auth.reauthenticate2(this.model.currentEmail, this.model.emailChangePass).then((credential) => {
				if (this.model.newEmail) {
					var changeemail = this.model.newEmail;
					this.auth.getUser().then((user) => {
						user.updateEmail(changeemail).then(() => {
							this.model.user.email = this.model.newEmail;
							this.model.email = "";
							this.success.emailChangeS = "Email Change Successful";
							this.model.newEmail = "";
							this.model.emailChangePass = "";
							this.errors.emailChangeE = "";
						}).catch((err) => {
							this.errors.emailChangeE = "Email Change Failed1";
							if (err.code == "auth/invalid-user-token" || err.code == "auth/email-already-in-use" || err.code == "auth/invalid-email")
								this.errors.newEmail = "Email already in use!"
						});
					});
				}
				else {
					this.auth.getUser().then((user) => {
						console.log(this.model);
						this.model.user.uid = user.uid;
						this.db.updateUser(this.model.user);
					})
				}
			}).catch((err) => {
				this.errors.emailChangeE = "Looks like you did not enter the correct email/password for this account. Email Change Failed";
				this.model.emailChangePass = "";
				this.model.newEmail = "";
			});
		}
		else {
			this.errors.emailChangeE = "Email Change Failed2";
			this.model.newEmail = "";
			this.model.emailChangePass = "";
		}
	}

	verifyPass() {
		Object.keys(this.errors).forEach((key) => {
			this.errors[key] = null;
		})
		var noErr = true;

		if (!this.model.currentPassword)
			this.errors.oldPass = "Please enter your password.";
		if (!this.model.newPassword)
			this.errors.newPass = "Please enter your new password.";
		else if (this.model.newPassword.length < 6)
			this.errors.newPass = "Password must be at least 6 characters long.";
		if (!this.model.conPassword)
			this.errors.conPass = "Please confirm your password.";
		if (this.model.newPassword != this.model.conPassword && !this.errors.oldPass && !this.errors.conPass)
			this.errors.conPass = "Passwords must match!";
		var noErr = true;
		Object.keys(this.errors).forEach((key) => {
			if (this.errors[key])
				noErr = false;
		})
		return noErr;
	}
	changepass() {
		console.log(this.model)
		if (this.verifyPass()) {
			this.auth.reauthenticate(this.model.currentPassword).then((credential) => {
				if ((this.model.newPassword == this.model.currentPassword || this.model.currentPassword == this.model.conPassword)) {
					this.errors.newPass = "Please pick a different password";
					this.errors.conPass = "Please pick a different password";
					this.model.newPassword = "";
					this.model.conPassword = "";
				}
				else if ((this.model.newPassword == this.model.conPassword)) {
					var changepass1 = this.model.newPassword;
					this.auth.getUser().then((user) => {
						console.log(user);
						console.log(this.model);
						user.updatePassword(changepass1).then(() => {
							this.model.newPassword = ""
							this.model.conPassword = ""
							this.model.currentPassword = ""
							this.success.passwordChangeS = "password change worked!!!";
						}).catch((err) => {
							//console.log(this.errors)
							this.errors.newPass = ""
							this.errors.conPass = ""
							this.errors.oldPass = ""
							this.model.newPassword = ""
							this.model.conPassword = ""
							this.model.currentPassword = ""
							this.errors.passwordChangeE = "Password Change Failed1"
						});
					});
				}
				else {
					this.auth.getUser().then((user) => {
						console.log(this.model);
						this.model.user.uid = user.uid;
						this.db.updateUser(this.model.user);
					})
				}
			}).catch((err) => {
				this.errors.newPass = "";
				this.errors.conPass = "";
				this.errors.oldPass = "Please enter your password.";
				this.errors.passwordChangeE = "Password Change Failed2";
				this.model.newPassword = "";
				this.model.conPassword = "";
				this.model.currentPassword = "";
			});
		}
		else if (!this.verifyPass()) {
			this.errors.passwordChangeE = "Password Change Failed";
			this.model.newPassword = "";
			this.model.conPassword = "";
			this.model.currentPassword = "";
		}
	}
	del() {
		if (this.model.password && this.model.email) {
			this.auth.reauthenticate2(this.model.email, this.model.password).then((credential) => {
				this.auth.getUser().then((user) => {
					this.db.deleteUser(user);
					this.auth.deleteUser(user);
					this.model.password = "";
					this.model.email = "";
					this.router.navigateByUrl("");
				});
			}).catch((err) => {
				this.errors.cred = "Incorrect Email and/or Password";
				this.model.password = "";
			});
		}
		else {
			this.errors.cred = "No Email and/or Password entered";
		}
	}
	handleError(error) {
		console.error('Error processing action', error);
	}
	link_youtube() {
		window.location.href =
		"https://accounts.google.com/o/oauth2/v2/auth" +
		"?client_id=374666659146-c9n74gdloum89050ckabsfssh0oe4qkl.apps.googleusercontent.com" +
		"&redirect_uri=http://localhost:4200/settings" +
		"&response_type=token" +
		"&scope=https://www.googleapis.com/auth/youtube.readonly"
	}
	unlink_youtube() {
		this.auth.getUser().then((u) => {
			this.db.deleteYoutubeData(u.uid).then(() => {
				this.inYoutube = false;
			}).catch((err) => {
				console.error(err);
			})
		}).catch((err) => {
			console.error(err);
		});
	}
	link_twitter() {
		console.log("Here");
		this.li.getFriends(this.model.user.screenName).then((data: any) => {
			console.log("Storing in database" + this.model.user.uid);
			this.db.storeTwitterFollowees(data.users, this.model.user.screenName, this.model.user.uid).then((data) => {
				console.log(data);
			});
		}).catch((err) => {
			console.log("Issue here");
			this.errors.twitterE = "you were not able to connect to twitter"
			this.model.user.screenName = "";
			/*If the code reaches this block it means we have an error */


		});
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
			console.log(res.status);
			if (res && res.status === 'unknown' || res.status === 'not_authorized') {
				this.fb.login(loginOptions).then((res: LoginResponse) => {
					console.log('Logged in', res);
				}).then(() => {
					this.fb.api('/me/taggable_friends?limit=5000').then((res: any) => {
						console.log(res);
						this.db.storeFacebookFriends(res.data, this.model.user.uid).then((data) => {
							console.log(data);
						}).catch((err) => {
							console.error(err);
						})
						console.log('Got the users friends', res);
						this.inFacebook = true;
					})
				}).catch(this.handleError);
			} else {
				console.log("Attempted to login when already logged in. We probably want to display an error message here");
			}
		})
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
	returnLoginStatus(): boolean {
		this.fb.getLoginStatus()
		.then(res => {
			if (res && res.status === 'connected') {
				this.inFacebook = true;
				console.log(true);
				return true;
			} else {
				this.inFacebook = false;
				console.log(false);
				return false;
			}
		})
		return false;
	}
	getLoginStatus() {
		this.fb.getLoginStatus()
		.then(console.log.bind(console))
		.catch(console.error.bind(console));
	}
	showClassList(subject: String) {
		this.inSubject = true;
		this.currSubject = subject;
		this.cs.getClasses(subject).then((classes) => {
			this.classList = classes;
			
		}).catch((err) => {
			console.log(err);
		})
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
		if(!this.userClasses || this.userClasses.indexOf(this.currSubject + " " + cl) == -1){
			this.db.addClass(this.model.user.uid, this.currSubject + " " + cl).then((success) => {
				this.inSubject = false;
				this.classList = [];
				console.log("Added class:", success);
	
				this.updateClasses();
			}).catch((err) => {
				console.log(err);
			})
		}
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

	verifyInterest(sub: string, inter: string) {
		var verify = new Map();
		console.log("this is what we got ", sub);
		console.log("looking in here ", this.allMap)
		this.allMap.get(sub).forEach((interests) => {
			verify.set(interests, 1);
			// console.log(interests)
		});
		//console.log("can find?", this.getArrayInter12(sub))
		console.log("looking through here ", verify)
		if (verify.get(inter)) {

			var ver1 = new Map();
			this.arraytemp = this.getArrayInter(sub);


			this.arraytemp.forEach((interests1) => {
				ver1.set(interests1, 1)

			});
			if (ver1.get(inter)) {
				return false;
			}
			else {
				return true;
			}
		}
		else {
			return false;
		}

	}


	addInterest(sub: string, inter: string) {
		console.log(sub + " " + inter);
		this.model.interestSelected = "";

		if (this.verifyInterest(sub, inter)) {
			this.db.addInterest(this.model.user.uid, sub, inter).then((success) => {
				this.model.interestSelected = ""

				//this.interestList = [];
				console.log("why")
				this.updateInterest();
			}).catch((err) => {
				console.log(err);
			})
		}
	}
	deleteInterest(sub: String, inter: String) {
		this.db.deleteInterest(this.model.user.uid, sub, inter).then((data) => {
			console.log("hi there");
			this.updateInterest();
		}).catch((err) => {
			console.log(err);
		})
	}
	clearAllCatInterests(sub: string) {
		console.log("not printing", sub);

		this.arraytemp = this.getArrayInter(sub);
		this.arraytemp.forEach((inter) => {
			this.deleteInterest(sub, inter);

		});
	}

	updateInterest() {
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
	// getArrayInter(sub: string): string[] {
	// 	//console.log("it got here fine")
	// 	this.interestSubArray = Object.values(this.interestList[sub]);
	// 	//console.log("what cause problems: ", this.interestSubArray)
	// 	return this.interestSubArray;

	// }
	getArrayInter(sub: string): string[] {
		//console.log("it got here fine ", sub)
		//console.log("it got here fine 2 ", this.interestList);
		if(!this.interestList)
			this.interestSubArray = [];
		else if(this.interestList[sub])
		this.interestSubArray = Object.values(this.interestList[sub]);
		else
			this.interestSubArray = [];
		return this.interestSubArray;


	}
	getArrayOfInterestKeys(): string[] {

		this.arrayOfInterestKeys = Object.keys(this.interestList);
		return this.arrayOfInterestKeys;

	}


	addFeedback(feedback: String) {
		if (this.model.feedback) {
			this.db.addFeedback(feedback).then((success) => {
				this.model.feedback = "";
				this.success.feedbackS = "Thank you for your feedback. It has been sent to our developers."
				//this.interestList = [];
				console.log("why")

			}).catch((err) => {
				this.errors.feedbackE = "Looks like there was an error. Please try again."
				console.log(err);
			})
		} else {
			this.errors.feedbackE = "Looks like you are tyring to submit nothing."

		}
	}
	addFeedbacktester(feedback: String) {
		if (this.model.feedback) {
				this.success.feedbackS = "Thank you for your feedback. It has been sent to our developers."			
		} else {
			this.errors.feedbackE = "Looks like you are tyring to submit nothing."

		}
	}




	constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private ar: ActivatedRoute, private db: DatabaseService, private fb: FacebookService, private li: twitterService, private cs: ClassesService, private loc: Location) {

		this.auth.isAuthed().then((user) => {
			console.log("Authed:", user)
		});

		this.auth.getUser().then((user) => {
			this.model.user.uid = user.uid;
			this.model.user.firstName = user.firstName;
			this.db.getUser(user.uid).then((userData) => {
				this.model.user = userData
				console.log(userData)
				this.url = this.model.user.url;

				this.updateClasses();
				this.updateInterest();
				this.db.getTwitterScreenName(user.uid).then((screenName) => {
					this.model.user.screenName = screenName;
				});
				this.db.getYoutubeStatus(user.uid).then((status) => {
					this.inYoutube = !!status;
					if (status) {
						this.db.getYoutubeSubscribers(user.uid).then((subs) => {
							console.log(subs);
						})
					}
				}).catch((err) => {
					console.error(err);
				})
			})
		});


		this.allMap = new Map();
		this.allMap.set("Country", this.interestObj.country)
		this.allMap.set("Movies", this.interestObj.movieGenre)
		this.allMap.set("Animals", this.interestObj.animal)
		this.allMap.set("Hobbies", this.interestObj.hobbies)
		this.allMap.set("Tv", this.interestObj.tvShows)
		this.allMap.set("Sports", this.interestObj.sports)
		this.allMap.set("Music", this.interestObj.musicGenre)
		this.allMap.set("Artists", this.interestObj.FavoriteArtists)
		this.allMap.set("Dance", this.interestObj.dance)
		this.allMap.set("Foods", this.interestObj.foods)
		this.allMap.set("Languages", this.interestObj.languages)
		this.allMap.set("Majors", this.interestObj.majors)








		fb.init({
			appId: '146089319399243',
			version: 'v2.12',
			cookie: true
		})
		this.inFacebook = this.returnLoginStatus();
		console.log("Facebook login status: " + this.inFacebook);
		this.cs.getSubjects().then((subjects) => {
			this.subjects = subjects;
		});

		//Detect Youtube access_token
		this.ar.fragment.subscribe((fragment) => {
			if (fragment) {
				var accessToken = fragment.split("&")[0];
				accessToken = accessToken.substring(accessToken.indexOf("=") + 1);
				if (!!accessToken) {
					this.auth.getUser().then((user) => {
						this.db.storeYoutubeSubscribers(user.uid, accessToken).then((data) => {
							console.log("Successfully stored youtube subscribers:", data);
							this.loc.go("/settings");
							this.inYoutube = true;
						})
					});
				}
			}
		});

	}
	ngOnInit() { }
}