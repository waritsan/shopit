const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Setting up config file
dotenv.config({ path: 'config/config.env' });

process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1);
});

// Connect database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});