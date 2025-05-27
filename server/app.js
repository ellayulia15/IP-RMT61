require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for CORS and request parsing
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'TutorHub API Server'
    });
});

// Routes
app.use(routes);

// Error handler middleware
app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        status = 400;
        message = err.errors[0].message;
    }

    res.status(status).json({ message });
});

app.listen(port, () => {
    console.log(`TutorHub server is running on port ${port}`);
});
