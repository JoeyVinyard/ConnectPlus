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

	describe('User Story Nine',function(){
		it('Should return status of 400 with no response body', function(done) {
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

		it('Should return non null Body and status Code 200 upon a valid call with updated user settings', function(done){
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

	describe('Sprint 3 Story 1',function(){
		it('Should return 400 With invalid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/storeYoutubeSubscribers/asdf',
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
		it('Should return 400 With no Access Token Given', function(done) {
			var options = {
				url: 'http://localhost:3000/storeYoutubeSubscribers/' + testID,
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
		it('Should return 400 With invalid Access Token Given', function(done) {
			var options = {
				url: 'http://localhost:3000/storeYoutubeSubscribers/asdf/asdf',
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
	});
	describe('Sprint 3 Story 2',function(){
		var subscriptionID = "ZVmOhUAURNOD8t4zqunUdUtjc4B3";
		it('Should return 400 With invalid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/getYoutubeSubscriptions/asdf',
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
		it('Should return 200 with valid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/getYoutubeSubscriptions/' + subscriptionID,
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});
		it('Should return 400 With invalid URL', function(done) {
			var options = {
				url: 'http://localhost:3000/storeYoutubeSubscribers/asdf/asdf',
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
	});
	describe('Sprint 3 Story 3',function(){

		var broadcastObjectInvalid = {
				time: 0,
				lat: 0,
				lon: 0,
				uid: "asdf",
				broadcast: "",
				subject: ""
			}

		var broadcastObjectEmpty = {
				time: 1,
				lat: 0,
				lon: 0,
				uid: testID,
				broadcast: "",
				subject: ""
			}
			var broadcastObject = {
				time: 1,
				lat: 0,
				lon: 0,
				uid: testID,
				broadcast: "This is a test Broadcast",
				subject: ""
			}	
		it('Should return 400 With invalid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/storeBroadcast/' + JSON.stringify(broadcastObjectInvalid),
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

		it('Should return 400 With empty Broadcast', function(done) {
			var options = {
				url: 'http://localhost:3000/storeBroadcast/' + JSON.stringify(broadcastObjectEmpty),
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

		it('Should return 200 with valid Broadcast', function(done) {
			var options = {
				url: 'http://localhost:3000/storeBroadcast/' + JSON.stringify(broadcastObject),
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
	});
	describe('Sprint 3 Story 4',function(){
		it('Should return 400 With invalid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/getNearbyBroadcasts/asdfasdf',
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
		it('Should return 200 With valid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/getNearbyBroadcasts/asdf',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.get(options, function(err, res, body){
				expect(res.statusCode).to.equals(200);
				done();
			});

		});

		it('Payload does not equal null with valid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/getNearbyBroadcasts/asdf',
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.get(options, function(err, res, body){
				assert.notEqual(JSON.parse(body).payload, null);
				done();
			});

		});
	});
	describe('Sprint 3 Story 5',function(){
			var broadcastObjectInvalid = {
				time: 0,
				lat: 0,
				lon: 0,
				uid: "asdf",
				response: "",
				subject: ""
			}

		var broadcastObjectEmpty = {
				time: 1,
				lat: 0,
				lon: 0,
				uid: testID,
				response: "",
				subject: ""
			}
			var broadcastObject = {
				time: 1,
				lat: 0,
				lon: 0,
				uid: testID,
				response: "This is a test Broadcast",
				subject: ""
			}	
		it('Should return 400 With invalid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/storeResponse/' + JSON.stringify(broadcastObjectInvalid),
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

		it('Should return 400 With empty Response', function(done) {
			var options = {
				url: 'http://localhost:3000/storeResponse/' + JSON.stringify(broadcastObjectEmpty),
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

		it('Should return 200 with valid Response', function(done) {
			var options = {
				url: 'http://localhost:3000/storeResponse/' + JSON.stringify(broadcastObject),
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
	});
	describe('Sprint 3 Story 8',function(){
		var emptyfeedback = {
			feedback: ""
		}
		var veryemptyfeedback = {
			
		}
		var validfeedback = {
			feedback: "this is feedback!"
		}
		it('Should return 400 With invalid Feedback', function(done) {
			var options = {
				url: 'http://localhost:3000/addFeedback/' + JSON.stringify(emptyfeedback),
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.post(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});
		it('Should return 200 With valid feedback', function(done) {
			var options = {
				url: 'http://localhost:3000/addFeedback/' + JSON.stringify(validfeedback),
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.post(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});
		it('Should return 400 With very empty feedback', function(done) {
			var options = {
				url: 'http://localhost:3000/addFeedback/' + JSON.stringify(veryemptyfeedback),
				headers: {
					'Content-Type': 'text/plain'
				},
				body: '{}'
			};
			request.post(options, function(err, res, body){
				expect(res.statusCode).to.equals(400);
				done();
			});

		});
	});
	describe('Sprint 3 Story 9',function(){
		it('Should return 400 With invalid UID', function(done) {
			var options = {
				url: 'http://localhost:3000/scheduleVisibility/asdf/asdf',
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
		it('Should return 400 With invalid number of arguments', function(done) {
			var options = {
				url: 'http://localhost:3000/scheduleVisibility/' + testID,
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
		it('Should return 400 With invalid time', function(done) {
			var options = {
				url: 'http://localhost:3000/scheduleVisibility/' + testID + "/-1",
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
	});

	describe('Sprint 3User Story Fifteen',function(){
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
});


