import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  authed = false;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.isAuthed().then((a) => {
      this.authed = a;
    })
  }

  logout(){
    this.auth.logout().then(() => {
      this.router.navigateByUrl("/");
      console.log("Successful Logout");
    })
  }

  ngOnInit() {
  }

}
