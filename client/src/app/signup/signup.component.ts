import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private auth: AuthService) {
  	auth.signup('vinyardjoseph@gmail.com', 'bucket1').then((user) => {
  		console.log(user);
  	}).catch((err) => {
  		console.error(err);
  	})
  }

  ngOnInit() {
  }
}
