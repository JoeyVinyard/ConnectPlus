import { Component, OnInit } from '@angular/core';

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

  toggleMood(){
    this.editMood = !this.editMood;
  }


  constructor() { }

  ngOnInit() {
  }

}
