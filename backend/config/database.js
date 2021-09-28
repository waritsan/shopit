const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB database connected with HOST: ${con.connection.host}`);
    });
}

module.exports = connectDatabase;