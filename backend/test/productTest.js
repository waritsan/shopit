const request = require('supertest');
const app = require('../app');

describe('GET /products', () => {
   it('should return a list of products', () => {
        return request(app)
            .get('/api/v1/products')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({
                success: true,
                message: 'This route will show all the products in the database.'
            });
   });
});