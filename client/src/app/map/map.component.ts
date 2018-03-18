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
	lat: number = 40.678418;
	lng: number = -76.809007;

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

  MoodStatus = "Mood Status";

  moodChange(){
      console.log(this.model);
      this.model.user.moodStatus = this.model.moodStatus;
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

  //ZOOM VALUE FOR MAP
  zoom: number = 15;
  currentZoom: number = 15;

  zoomMap(){
    this.zoom = this.currentZoom;
    
  }

  private icon = {
    url: this.model.user.url, 
    scaledSize: {
      height: 40,
      width: 20
    }
  };


  particlesConfig;
  submitted = false;


  constructor(private auth: AuthService, public pConfig: ParticlesConfigService, private router: Router, private db: DatabaseService, public loc: LocationService ) {

    loc.getLocation().then((l)=> {
      auth.getUser().then((u) => {
        db.storeLocation(l, u.uid).then((d) =>{
          console.log(d);
          this.lat = l.latitude;
          this.lng = l.longitude;
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
         this.model.moodStatus = userData.moodStatus;

        this.model.user = userData;
        console.log(userData)
      })
     // this.model.user.fullName = this.model.user.firstName + ' ' + this.model.user.lastName;
    //  let fullname = this.model.user.firstName + ' ' + this.model.user.lastName;
     // this.model.user.fullName = this.model.user.firstName;




    });


  }

  ngOnInit() {
  }

}
