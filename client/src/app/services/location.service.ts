import { Injectable } from '@angular/core';

@Injectable()
export class LocationService {

  getLocation(): Promise<any>{
    return new Promise((resolve, reject) => {
      console.log("got called");
      window.navigator.geolocation.getCurrentPosition((pos) => {
        console.warn(pos);
        if(pos)
          resolve(pos.coords);
        else
          reject("Location Denied");
      });
    })
  }
  constructor() { }

}
