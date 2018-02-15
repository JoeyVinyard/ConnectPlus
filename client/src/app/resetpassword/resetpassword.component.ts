import { Component, OnInit } from '@angular/core';
import { ParticlesConfigService } from '../services/particles-config.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
 
	constructor(public pConfig: ParticlesConfigService) {}

	ngOnInit() {}

}
