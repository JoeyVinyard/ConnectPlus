import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {


	constructor(public pConfig: ParticlesConfigService) {}


  ngOnInit() {
  }

}
