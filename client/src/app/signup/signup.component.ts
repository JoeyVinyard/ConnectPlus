import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	errors: {
		email: string,
		password: string,
		confpass: string
	}
	model: {
		email: string,
		password: string,
		confpass: string
	}
	submitted = false;

	submit(){
		this.submitted = true;
		if(!this.verify())
			return;
		this.auth.signup(this.model.email, this.model.password).then((user) => {
			//Success, redirect user to next page
		}).catch((err) => {
			this.submitted = false;
			Object.keys(this.model).forEach((key)=>{
				this.model[key] = null;
			});
			if(err.code == "auth/email-already-in-use")
				this.errors.email = "Email already in use!"
		})
	}	
	verify(){
		Object.keys(this.errors).forEach((key)=>{
			this.errors[key] = null;
		})
		
		//Sanitize input here
		if(!this.model.email)
			this.errors.email = "Please provide an email.";
		if(this.model.password.length<6)
			this.errors.password = "Password must be at least 6 characters long."
		if(!this.model.password)
			this.errors.password = "Please enter your password.";
		if(!this.model.confpass)
			this.errors.confpass = "Please confirm your password.";
		if(this.model.password != this.model.confpass && this.errors.password && this.errors.confpass)
			this.errors.confpass = "Passwords must match!";

		var noErr = true;
		Object.keys(this.errors).forEach((key)=>{
			if(!this.errors[key])
				noErr = false;
		})
		return noErr;
	}

	constructor(private auth: AuthService) {
		this.auth.signup("vinyardjoseph@gmail.com", "daddy123").then((user) => {
			console.log("Signup worked", user);
		}).catch((err) => {
			console.error(err);
		})
	}
	
	myStyle: object = {};
	myParams: object = {};
	width: number = 100;
	height: number = 100;

	ngOnInit() {
		this.myStyle = {
			'position': 'fixed',
			'width': '100%',
			'height': '100%',
			'z-index': -1,
			'top': 0,
			'left': 0,
			'right': 0,
			'bottom': 0,
		};

		this.myParams = {
			"particles": {
			  "number": {
				"value": 202,
				"density": {
				  "enable": true,
				  "value_area": 721.5354273894853
				}
			  },
			  "color": {
				"value": "#ffffff"
			  },
			  "shape": {
				"type": "circle",
				"stroke": {
				  "width": 0,
				  "color": "#000000"
				},
				"polygon": {
				  "nb_sides": 5
				},
				"image": {
				  "src": "img/github.svg",
				  "width": 100,
				  "height": 100
				}
			  },
			  "opacity": {
				"value": 0.5,
				"random": false,
				"anim": {
				  "enable": false,
				  "speed": 1,
				  "opacity_min": 0.1,
				  "sync": false
				}
			  },
			  "size": {
				"value": 3,
				"random": true,
				"anim": {
				  "enable": false,
				  "speed": 40,
				  "size_min": 0.1,
				  "sync": false
				}
			  },
			  "line_linked": {
				"enable": true,
				"distance": 150,
				"color": "#ffffff",
				"opacity": 0.4,
				"width": 1
			  },
			  "move": {
				"enable": true,
				"speed": 3,
				"direction": "none",
				"random": false,
				"straight": false,
				"out_mode": "out",
				"bounce": false,
				"attract": {
				  "enable": false,
				  "rotateX": 600,
				  "rotateY": 1200
				}
			  }
			},
			"interactivity": {
			  "detect_on": "canvas",
			  "events": {
				"onhover": {
				  "enable": true,
				  "mode": "bubble"
				},
				"onclick": {
				  "enable": true,
				  "mode": "repulse"
				},
				"resize": true
			  },
			  "modes": {
				"grab": {
				  "distance": 400,
				  "line_linked": {
					"opacity": 1
				  }
				},
				"bubble": {
				  "distance": 231.44200550588337,
				  "size": 4.120772123013452,
				  "duration": 2,
				  "opacity": 1,
				  "speed": 3
				},
				"repulse": {
				  "distance": 100.84540486109416,
				  "duration": 0.4
				},
				"push": {
				  "particles_nb": 4
				},
				"remove": {
				  "particles_nb": 2
				}
			  }
			},
			"retina_detect": true
		  };
	}

}
