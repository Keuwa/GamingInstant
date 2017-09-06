/**
* Created by Grunt on 06/07/17.
*/
var supertest = require("supertest");
var should = require("should");

var correctUser = {
  email: 'tu@gmail.com',
  password: 'tu',
  gender: "M",
  lastname: 'Unitaires',
  firstname: 'Tests',
  size: "180"
};
var incorrectUser = {
  email: 'tu@.com',
  password: 'tutitota',
  gender: "M",
  lastname: 'Unitaires',
  firstname: 'Tests',
  size: "150"
};
var newWeight = {
  weight: 90
};
var addedWeighting;
var scaleKey = 'testBalance';


/*"id": "236543-dsd5454sd-ds54",
"lastname": "Leprat",
"firstname": "Quentin",
"birthdate": "1993-08-01",
"email": "yolo@gmail.com",
"password": "password",
"gender": "F"*/

var Tester = {
  email: 'toto@gmail.com',
  password: 'test',
  gender: 'F',
  lastname: 'De Choc',
  firstname: 'Testeur',
  size: "142"
};

var authUser;
var authTester;

var server = supertest.agent("http://localhost:3000");
var authToken;
var authTokenTester;
var candidates;
var scaleId;
var Scale;

describe('API', function () {
  describe('Users /', function () {
    it('POST /users should create user', function () {
      return server
      .post('/users/')
      .send(correctUser)
      .expect(201);
    }),

    it('POST /users should create tester', function () {
      return server
      .post('/users/')
      .send(Tester)
      .expect(201);
    }),

    it('POST /users should not create user because there already is an account with this email', function () {
      return server
      .post('/users/')
      .send(correctUser)
      .expect(409);
    }),

    it('POST /users should not create user because the mail adress is not valid', function () {
      incorrectUser.email = 'tu@.com';
      return server
      .post('/users/')
      .send(incorrectUser)
      .expect(400);
    }),

    it('POST /users should not create user because the mail adress is not given', function () {
      incorrectUser = {
        password: 'tututoto',
        gender: "M"
      };
      return server
      .post('/users/')
      .send(incorrectUser)
      .expect(400);
    }),

    /*Verify if user already exists*/
    it('POST /users should not create user because he already exists', function () {
      correctUser = {
        email: 'tu@gmail.com',
        password: 'tu',
        gender: "M",
        lastname: 'Unitaires',
        firstname: 'Tests',
        size: "180"
      };
      return server
      .post('/users/')
      .send(correctUser)
      .expect(409);
    }),

    it('GET /users should return the users list', function(){
      return server
      .get('/users/')
      .expect(200);
    }),

    it('PUT /users should not edit unauthorized user', function () {
      var incorrectUser = {
        email: 'tu@gmail.com',
        password: 'tuc,ec',
        name: 'Toto'
      };
      return server
      .put('/users/')
      .send(incorrectUser)
      .expect(401);
    });
  });

  /* AUTH USER FOR CONTINUE  */
  describe('AUTH /', function () {
    it('POST /login should not authenticate user with bad credentials', function () {
      var incorrectUser = {
        email: 'tu@gmail.com',
        password: 'tutu'
      };
      return server
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(incorrectUser)
      .expect(401);
    }),

    it('POST /login should authenticate user', function () {
      return server
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(correctUser)
      .expect(200)
      .expect(function (res, err) {
        authToken = res.header['x-auth-token'];
        res.body.email.should.equal(correctUser.email);
        authUser = res.body;
      });
    }),

    it('POST /login should authenticate tester', function () {
      return server
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(Tester)
      .expect(200)
      .expect(function (res, err) {
        authTokenTester = res.header['x-auth-token'];
        res.body.email.should.equal(Tester.email);
        authTester = res.body;
      });
    });
  });

  describe('Users /', function () {
    it('GET /users/{idUser} should return current user', function(){
      return server
      .get('/users/' + authUser.id)
      .set('X-AUTH-TOKEN', authToken)
      .expect(200)
      .expect(function (res, err){
        res.body.email.should.equal(authUser.email);
      });
    }),

    it('GET /users/{idUser} with invalid id should return 404', function(){
      return server
      .get('/users/117')
      .set('X-AUTH-TOKEN', authToken)
      .expect(404);
    }),

    it('PUT /users should edit user', function () {
      var User = {
        email: 'tu@gmail.com',
        password: 'tutotoaaaa',
        gender: 'M',
        lastname: 'Toto',
        firstname: 'Le Héros',
        size: "150"
      };
      return server
      .put('/users/')
      .set('X-AUTH-TOKEN', authToken)
      .send(User)
      .expect(200)
      .expect(function (res, err) {
        res.body.lastname.should.equal(User.lastname)
      });
    }),

    it('GET /users/weightings should show an empty list', function () {
      return server
      .get('/users/weightings')
      .set('X-AUTH-TOKEN', authToken)
      .expect(200)
      .expect(function (res, err) {
        res.body.length.should.equal(0);
      });
    });
  });

  describe('Scales /', function () {
    it('POST /scales should create a scale and link it to the user', function () {
      Scale = {
        key: scaleKey,
        tag: 'BalanceMaisonTU',
        mac: "00:00:00:00:00:00"
      };
      return server
      .post('/scales')
      .set('Content-Type', 'application/json')
      .send(Scale)
      .expect(201)
      .expect(function (res, err) {
        scaleId = res.body.id;
      });
    });

    it('GET /scales should return the scales list', function(){
      return server
      .get('/scales/')
      .expect(200)
      .expect(function (res, err) {
        Scale = res.body[0];
        res.body.length.should.above(0);
      });
    });

    it('POST /scales/user should link a scale to the user', function () {
      var ScaleToLink = Scale;
      ScaleToLink.idUser = authUser.id;
      ScaleToLink.scaleName = 'Balance maison TU';
      return server
      .post('/scales/user')
      .set('Authorization', scaleKey)
      .set('Content-Type', 'application/json')
      .send(ScaleToLink)
      .expect(201);
    });
  });

  describe('Scales /', function () {
    it('POST /scales/weightings should add a weight for the user with the scale key', function () {
      newWeight.idUser = authUser.id;
      return server
      .post('/scales/weightings')
      .set('Authorization', scaleKey)
      .set('Content-Type', 'application/json')
      .send(newWeight)
      .expect(201);
    }),

    it('DELETE /scales/{idScale} should be deleted', function () {
      return server
      .delete('/scales/' + Scale.id)
      .set('X-AUTH-TOKEN', authToken)
      .expect(204);
    });
  });

  describe('Users /', function () {
    it('GET /users/weightings should show an list with 1 wheighting of this month', function () {
      return server
      .get('/users/weightings')
      .set('X-AUTH-TOKEN', authToken)
      .expect(200)
      .expect(function (res, err) {
        res.body.length.should.equal(1);
        addedWeighting = res.body[0];
      });
    }),

    it('GET /users/weightings/{year}/{month} should show an empty list for april 2017', function () {
      return server
      .get('/users/weightings/2017/04')
      .set('X-AUTH-TOKEN', authToken)
      .expect(200)
      .expect(function (res, err) {
        res.body.length.should.equal(0);
      });
    }),

    it('DELETE /users/weighting/{idWeighting} should delete the weighting', function () {
      return server
      .delete('/users/weighting/' + addedWeighting.id)
      .set('X-AUTH-TOKEN', authToken)
      .expect(204);
    }),

    it('GET /users/weightings should show an empty list because weighting has been deleted', function () {
      return server
      .get('/users/weightings')
      .set('X-AUTH-TOKEN', authToken)
      .expect(200)
      .expect(function (res, err) {
        res.body.length.should.equal(0);
      });
    }),

    it('DELETE /users should be deleted', function () {
      return server
      .delete('/users/')
      .set('X-AUTH-TOKEN', authToken)
      .expect(204);
    });

    it('DELETE /users should delete tester', function () {
      return server
      .delete('/users/')
      .set('X-AUTH-TOKEN', authTokenTester)
      .expect(204);
    });
  });

  describe('AUTH /', function () {
    it('POST /login should not authenticate unexisting user', function () {
      return server
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(correctUser)
      .expect(401);
    });
  });
});
