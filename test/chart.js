const db = require("../models");
const Chart = db.chart;

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../');
const should = chai.should();


chai.use(chaiHttp);

describe('Chart testing', () => {
	/*
  * Test the /GET route
  */
  describe('/GET chart', () => {
		it('it should GET all the charts', (done) => {
			chai.request(server)
					.get('/chart')
					.end(async (err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.success.should.be.eql(true);
						const data = await Chart.findAll()
						res.body.data.length.should.be.eql(data.length);
						done();
					});
		});
  });

	describe('/GET bar', () => {
		it('it should GET data for bar chart', (done) => {
			chai.request(server)
					.get('/bar')
					.end(async (err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.success.should.be.eql(true);
						res.body.data.should.have.property('youngAdult');
						res.body.data.should.have.property('adult');
						res.body.data.should.have.property('seniors');
						done();
					});
		});
  });

	describe('/GET pie', () => {
		it('it should GET data for pie charts', (done) => {
			chai.request(server)
					.get('/pie')
					.end(async (err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.success.should.be.eql(true);
						res.body.data.should.have.property('noOfMale');
						res.body.data.should.have.property('noOfFemale');
						done();
					});
		});
  });

	describe('/POST chart', () => {
		it('it should not create a user for chart with wrong data', (done) => {
			const user = {
				name: "",
				age: "",
				gender : 'Male'
			}
			chai.request(server)
					.post('/chart')
					.send(user)
					.end(async (err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						done();
					});
		});

		it('it should create a user for chart with true data', (done) => {
			const name = "HeinH"
			const user = {
				name: name,
				age: 20,
				gender : 'M'
			}
			chai.request(server)
					.post('/chart')
					.send(user)
					.end(async (err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.success.should.be.eql(true);
						res.body.data.name.should.be.eql(name);
						done();
					});
		});
  });

});
