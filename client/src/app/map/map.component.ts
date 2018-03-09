import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ParticlesConfigService } from '../services/particles-config.service';
import { User } from '../services/user';
import { DatabaseService } from '../services/database.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	title: string = 'My first AGM project';
	lat: number = 40.678418;
	lng: number = -86.809007;

  editMood = false;
  editRange = false;

  toggleMood(){
    this.editMood = !this.editMood;
  }

  toggleRange(){
    this.editRange = !this.editRange;
  }

  model = {
    user: new User(),
    moodStatus: ""
  }
  errors = {
    mood: ""
  }

  moodChange(){
      console.log(this.model);

    this.auth.getUser().then((user) => {
      //this.model.user.uid = user.uid;
      this.db.updateUser(this.model.user).then((data) => {
        console.log(data);
        // console.log(user.data.moodStatus);

        this.errors.mood = "Your mood status has been updated!"
        //this.router.navigateByUrl('map');
      }).catch((err)=>{
        console.error(err);
        this.errors.mood = "Your mood status has NOT been updated!"

        //Form rejected for some reason
      })
    });


  }

  particlesConfig;
  submitted = false;


  constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService, public loc: LocationService ) {

    loc.getLocation().then((l)=> {
      auth.getUser().then((u) => {
        db.storeLocation(l, u.uid).then((d) =>{
          console.log(d);
        }).catch((e) =>{
          console.error(e);
        })
      })
		})

    this.auth.isAuthed().then((user) => {
      console.log("Authed:",user)
      this.model.user.uid = user.uid;
    });  


    this.auth.getUser().then((user) => {
      this.model.user.uid = user.uid;
      this.db.getUser(user.uid).then((userData) => {

        this.model.user = userData
        console.log(userData)
      })



    });


  }

  ngOnInit() {
  }

}
