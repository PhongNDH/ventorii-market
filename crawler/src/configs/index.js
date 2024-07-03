import "dotenv/config.js";
import app from './app.config.js';
import database from './database.config.js';

const config = {
    app: app,
    database: database
};

export default config;