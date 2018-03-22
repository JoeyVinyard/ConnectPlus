module.exports = {
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
	},
	toRad(val) {
		return val * Math.PI / 180;
	}
}