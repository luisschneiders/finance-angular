const request = require('supertest');
const server = require('../../server');
const sinon = require('sinon');

describe('GET /', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /contact', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/contact')
      .expect(302, done);
  });
});

describe('GET /signup', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/signup')
      .expect(302, done);
  });
});

describe('GET /login', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/login')
      .expect(302, done);
  });
});

describe('GET /account', function() {
  it('should render ok', function(done) {
    request(server)
      .get('/account')
      .expect(302, done);
  });
});
