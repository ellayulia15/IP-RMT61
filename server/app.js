require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

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
app.use(errorHandler);

app.listen(port, () => {
    console.log(`TutorHub server is running on port ${port}`);
});
