const request = require('supertest');
const assert = require('assert');

const app = require('../app');
const connectDatabase = require('../config/database');

beforeEach(() => {
    connectDatabase();
});

describe('GET /products', () => {
   it('should return a list of products', done => {
        request(app)
            .get('/api/v1/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert(response.body.success);
                assert.equal(response.body.count, 9);
                assert.equal(response.body.products.length, 9);
                done();
            })
            .catch(err => done(err))
   });
});