import { Injectable } from '@angular/core';

@Injectable()
export class LocationService {
	getLocation(): Promise<any>{
		return new Promise((resolve, reject) => {
			window.navigator.geolocation.getCurrentPosition((pos) => {
				console.warn(pos);
				if(pos)
					resolve(pos.coords);
				else
					reject("Location Denied");
			});
		})
	}
	getClusters(nearby, clusterDistance) {
		var clusters = [];
		for(var i = 0; i < nearby.length; i++){
			var cluster = {
				lat: nearby[i].lat,
				lon: nearby[i].lon,
				users: []
			};
			cluster.users.push(nearby[i]);
			for(var j = i+1; j < nearby.length; j++){
				var d = this.getDistance({lat: nearby[i].lat,lon: nearby[i].lon},{lat: nearby[j].lat,lon: nearby[j].lon})
				if(d < clusterDistance){
					cluster.users.push(nearby[j]);
					nearby.splice(j, 1);
				}
			}
			if(cluster.users.length > 1)
				clusters.push(cluster);
		}
		return clusters;
	}
	getDistance(locOne, locTwo){
		var lat1 = locOne.lat;
		var lon1 = locOne.lon;
		var lat2 = locTwo.lat;
		var lon2 = locTwo.lon;
		var r = 6371e3;
		var φ1 = this.toRad(lat1);
		var φ2 = this.toRad(lat2);
		var Δφ = this.toRad((lat2-lat1));
		var Δλ = this.toRad((lon2-lon1));

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = (r * c)*3.28084;
		return d;
	}
	toRad(val) {
		return val * Math.PI / 180;
	}
	constructor() { }

}
