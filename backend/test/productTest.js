const request = require('supertest');
const assert = require('assert');

const app = require('../app');
const Product = require('../models/product');
const seedProducts = require('../utils/seeder');

beforeEach(async () => {
    await seedProducts();
});

describe('GET /products', () => {
   it('should return a list of products', done => {
        request(app)
            .get('/api/v1/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert(res.body.success);
                assert.equal(res.body.count, 9);
                assert.equal(res.body.products.length, 9);
                done();
            })
            .catch(err => done(err))
   });
});

describe('GET /product/:id', () => {
    it('should return a single product', async () => {
        const product = await Product.findOne({ name: "SanDisk Ultra 128GB SDXC UHS-I Memory Card up to 80MB/s" });
        
        const res = await request(app)
            .get(`/api/v1/product/${product.id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        assert(res.body.success);
        assert.equal(res.body.product._id, product.id);
        assert.equal(res.body.product.name, "SanDisk Ultra 128GB SDXC UHS-I Memory Card up to 80MB/s")
   });
});

describe('POST /product/new', () => {
    it('shoud create a new product', done => {
        request(app)
            .post('/api/v1/product/new')
            .send({
                "name" : "Test name",
                "price" : "100",
                "description" : "Test description",
                "ratings" : 3.5,
                "images" : [{
                    "public_id" : "products/dsvbpny402gelwugv2le",
                    "url" : "https://res.cloudinary.com/bookit/image/upload/v1608062030/products/dsvbpny402gelwugv2le.jpg"
                }],
                "category" : "Electronics",
                "seller" : "Ebay",
                "stock" : 100,
                "numOfReviews" : 10,
                "reviews": []
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                assert(res.body.success);
                done();
            })
            .catch(err => done(err))
    });
});