import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  authed: boolean;

  constructor(private auth: AuthService) {
    this.auth.isAuthed().then((a) => {
      this.authed = a;
    })
  }

  ngOnInit() {
  }

}
