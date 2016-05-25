var expect = require('chai').expect;
var server = require('./server/default');

describe('MiniProfiler Share Tests', function() {
  before(server.start);
  after(server.stop);

  var expectOkResponse = (done) => (err, response, body) => {
    expect(response.statusCode).to.be.equal(200);
    expect(response.headers['content-type']).to.be.equal('text/html');
    done();
  };

  var expectNotFoundResponse = (done) => (err, response, body) => {
    expect(response.statusCode).to.be.equal(404);
    expect(response.headers['content-type']).to.be.equal('text/plain');
    done();
  };

  it('[GET] Valid profiled id should render share page', function(done) {
    server.get('/', (err, response) => {
      var ids = JSON.parse(response.headers['x-miniprofiler-ids']);

      server.get(`/mini-profiler-resources/results?id=${ids[0]}`, expectOkResponse(done));

    });
  });

  it('[POST] Valid profiled id should render share page', function(done) {
    server.get('/', (err, response) => {
      var ids = JSON.parse(response.headers['x-miniprofiler-ids']);

      server.post('/mini-profiler-resources/results', { id: ids[0] }, expectOkResponse(done));

    });
  });

  it('[GET] Invalid profiled id should render 404', function(done) {
    server.get('/mini-profiler-resources/results?id=123', expectNotFoundResponse(done));
  });

  it('[POST] Invalid profiled id should render 404', function(done) {
    server.post('/mini-profiler-resources/results', { id: 123 }, expectNotFoundResponse(done));
  });

});