var expect = require('Chai').expect;
var server = require('../server.js');
var request = require('request');
/*var firebase = require('firebase');
var config = require('../config.js');
firebase.initializeApp(config.fbConfig);
firebase.auth().signInWithEm/*ailAndPassword("admin@connectpl.us", config.password);*/

/*

*/
var testID = "c0b7mN9vaaUtw77KN8HYrDi86CQ2";
describe('HTTP Unit Tests', function () {

	before(function () {

		server.listen(3000);

		
	});

	after(function (done) {

		server.close();
		done();
	});

	describe('getUser Tests',function(){
		it('Should return 400 With no UID Given', function(done) {
			var options = {
				url: 'http://localhost:3000/getUser/',
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){
				
				expect(res.statusCode).to.equals(400);

				done();
			});

		});

		it('Should Return a valid user object', function(done){
			var options = {
				url: 'http://localhost:3000/getUser/' + testID,
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){

				expect(res.statusCode).to.equals(200);

				done();
			});

		});

		it("Should return a 400 Error on invalid UID", function(done) {
			var options = {
				url: 'http://localhost:3000/getUser/' + "asdfasdf",
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){
//				console.log();
				expect(res.statusCode).to.equal(200);
				expect(JSON.parse(body).payload).to.equals(null);
				done();
			});
		});
	});

});


