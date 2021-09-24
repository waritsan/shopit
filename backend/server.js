const app = require('./app');
const dotenv = require('dotenv');

// Setting up config file
dotenv.config({ path: 'config/config.env' });

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});