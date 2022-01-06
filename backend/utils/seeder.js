const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

// Setting dotenv file
dotenv.config({ path: './config/config.env' });

connectDatabase();
console.log('Hi');
const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('Producted are deleted.');

        await Product.insertMany(products);
        console.log('All products are added.');

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts();

module.exports = seedProducts;