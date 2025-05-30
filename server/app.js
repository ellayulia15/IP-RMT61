if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware for CORS and request parsing
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'TutorHub API Server'
    });
});

// Routes
app.use(routes);

// Error handler middleware
app.use(errorHandler);

module.exports = app; 
