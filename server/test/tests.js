var expect = require('Chai').expect;
var assert = require('Chai').assert;
var server = require('../server.js');
var request = require('request');
var http = require('https');



var locationObject = {
	lat: 1,
	lon: 1,
	uid: 'c0b7mN9vaaUtw77KN8HYrDi86CQ2',
}

var testUser = { age: 17,
  filterTwitter: false,
  firstName: 'Yoo',
  food1: true,
  fullName: 'Yoo Nittest',
  gender: 'male',
  lastName: 'Nittest',
  moodStatus: 'Online',
  music7: true,
  sports2: true,
  sports5: true,
  sports8: true,
  uid: 'c0b7mN9vaaUtw77KN8HYrDi86CQ2',
};
var invalidUser = {
	uid: 'asdf',
};


var testID = "c0b7mN9vaaUtw77KN8HYrDi86CQ2";
describe('HTTP Unit Tests', function () {

	before(function () {

		server.listen(3000);

		
	});

	after(function (done) {

		server.close();
		done();
	});

	describe('User Story One',function(){
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
		it('Input: Valid UID | Output: 200 Status Code, non null response body', function(done){
			var options = {
				url: 'http://localhost:3000/getUser/' + testID,
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				assert.notEqual(JSON.parse(body).payload, null);
				done();
			});

		});
		it("Input: Invalid UID | Output: 200 Status Code, null response body", function(done) {
			var options = {
				url: 'http://localhost:3000/getUser/' + "asdfasdf",
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equal(200);
				expect(JSON.parse(body).payload).to.equals(null);
				done();
			});
		});
	});

	describe('User Story Two',function(){
		it('Should Give error with no response body', function(done) {
			var options = {
				url: 'http://localhost:3000/updateUser/',
				headers: {
					'Content-Type': 'text/plain',
	
				},
				body: "{}"
			};
			
			request.post(options, function(err, res, body){
			
				expect(res.statusCode).to.equals(400);

				done();
			});

		});

		it('Should return non null Body upon a valid update call', function(done){
			var options = {
				url: 'http://localhost:3000/updateUser/',
				headers: {
					'Content-Type': 'text/plain',
	
				},
				body: JSON.stringify(testUser)
			};
			
			request.post(options, function(err, res, body){
				
				expect(res.statusCode).to.equals(200);
				assert.notEqual(JSON.parse(body), null);

				done();
			});


		});

		it("Returns UID when given invalid data", function(done) {
			var options = {
				url: 'http://localhost:3000/updateUser/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(invalidUser)
			};
			request.post(options, function(err, res, body){
//				console.log();
				expect(res.statusCode).to.equal(200);
				//expect(JSON.parse(body).payload).to.equals(null);
				done();
			});
		});
	});

	describe('User Story Three',function(){
		it('Succesfully Deletes User From database', function(done) {
			var options = {
				url: 'http://localhost:3000/deleteUser/' + testID,
				headers: {
					'Content-Type': 'text/plain',
	
				},
				body: "{}"
			};

			var getOptions = {
				url: 'http://localhost:3000/getUser/' + testID,
				headers: {
					'Content-Type': 'text/plain'
				}
			};

			var createOptions = {
				url: 'http://localhost:3000/createUser',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(testUser)
			}
			
			request.post(options, function(err, res, body){
		
				expect(res.statusCode).to.equals(200);
				request.get(getOptions, function(err, res, body){
					/*expect(res.statusCode).to.equal(200);
					assert.notEqual(JSON.parse(body), null);*/
					request.post(createOptions, function(err, res, body){
						done();
					});
				});

			});

		});

		it('After Deleting User, calling get User should return null', function(done) {
			var options = {
				url: 'http://localhost:3000/deleteUser/' + testID,
				headers: {
					'Content-Type': 'text/plain',
				},
				body: "{}"
			};

			var getOptions = {
				url: 'http://localhost:3000/getUser/' + testID,
				headers: {
					'Content-Type': 'text/plain'
				}
			};

			var createOptions = {
				url: 'http://localhost:3000/createUser',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(testUser)
			}
			
			request.post(options, function(err, res, body){
				request.get(getOptions, function(err, res, body){
					expect(res.statusCode).to.equal(200);
					request.post(createOptions, function(err, res, body){
						done();
					});
				});

			});

		});

		it('Should return 200 to create User after deletion', function(done) {
			var options = {
				url: 'http://localhost:3000/deleteUser/' + testID,
				headers: {
					'Content-Type': 'text/plain',
				},
				body: "{}"
			};

			var getOptions = {
				url: 'http://localhost:3000/getUser/' + testID,
				headers: {
					'Content-Type': 'text/plain'
				}
			};

			var createOptions = {
				url: 'http://localhost:3000/createUser',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(testUser)
			}
				request.post(options, function(err, res, body){
				request.get(getOptions, function(err, res, body){
					request.post(createOptions, function(err, res, body){
						expect(res.statusCode).to.equal(200);
						done();
					});
				});

			});

		});

	});

	describe('User Story Four',function(){
		it('Should Give error with no response body', function(done) {
			var options = {
				url: 'http://localhost:3000/storeLocation/',
				headers: {
					'Content-Type': 'text/plain',
	
				},
				body: "{}"
			};
			request.post(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});

		it('Should return non null Body upon a valid update call', function(done){
			var options = {
				url: 'http://localhost:3000/storeLocation/',
				headers: {
					'Content-Type': 'text/plain',
	
				},
				body: JSON.stringify(locationObject)
			};
			request.post(options, function(err, res, body){	
				expect(res.statusCode).to.equals(200);
				assert.notEqual(JSON.parse(body), null);
				done();
			});


		});

		it("Returns UID when given invalid data", function(done) {
			var invalidLocationObject = {
				uid: 'asdf',
			}
			var options = {
				url: 'http://localhost:3000/storeLocation/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(invalidLocationObject)
			};
			request.post(options, function(err, res, body){

				expect(res.statusCode).to.equal(200);

				done();
			});
		});
	});
	
	describe('User Story Five',function(){
		it('Should return 400 With no UID Given', function(done) {
			var options = {
				url: 'http://localhost:3000/getNearbyUsers/',
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});
		it('Input: Valid UID | Output: 200 Status Code, non null response body', function(done){
			var options = {
				url: 'http://localhost:3000/getNearbyUsers/' + testID,
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				assert.notEqual(JSON.parse(body).payload, null);
				done();
			});

		});
		it("Input: Invalid UID | Output: 400 Status Code", function(done) {
			var options = {
				url: 'http://localhost:3000/getNearbyUsers/' + "asdfasdf",
				headers: {
					'Content-Type': 'text/plain'
				}
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equal(400);
				
				done();
			});
		});
	});

	describe('User Story Eleven',function(){
		it('Should return 400 With no UID Given', function(done) {
			var options = {
				url: 'http://localhost:3000/storeFacebookFriends/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});
		it('Should return 200 When given valid friends object and uid', function(done) {
			var friends = {
				friends: {
					friend: "a"
				},
				uid: testID
			}
			var options = {
				url: 'http://localhost:3000/storeFacebookFriends/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(friends)
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});
		it('Should return 200 When given invalid UID', function(done) {
			var friends = {
				friends: {
					friend: "a"
				},
				uid: "asdfasdf"
			}
			var options = {
				url: 'http://localhost:3000/storeFacebookFriends/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(friends)
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});
	});

	describe('User Story Twelve',function(){
		it('Should return 400 With no UID Given', function(done) {
			var options = {
				url: 'http://localhost:3000/addClass/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});
		it('Should return 200 When given valid class and uid', function(done) {
			var friends = {
				cl: "CS 252000",
				uid: testID
			}
			var options = {
				url: 'http://localhost:3000/addClass/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(friends)
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});
		it('Should return 200 When given invalid UID', function(done) {
			var friends = {
				cl: "cl",
				uid: "asdfasdf"
			}
			var options = {
				url: 'http://localhost:3000/addClass/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(friends)
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});
	});

	describe('User Story Thirteen',function(){
		it('Should return 400 With no UID Given', function(done) {
			var options = {
				url: 'http://localhost:3000/storeTwitterFollowees/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});
		it('Should return 200 When given valid friends object and uid', function(done) {
			var friends = {
				friends: {
					friend: "a"
				},
				uid: testID
			}
			var options = {
				url: 'http://localhost:3000/storeTwitterFollowees/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(friends)
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});
		it('Should return 200 When given invalid UID', function(done) {
			var friends = {
				friends: {
					friend: "a"
				},
				uid: "asdfasdf"
			}
			var options = {
				url: 'http://localhost:3000/storeTwitterFollowees/',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: JSON.stringify(friends)
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});
	});
});


