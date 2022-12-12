const express = require('express');
const app = express();
const userRoutes = require('./routes/api/userRoutes');
const logger = require('./middleware/logger');

app.use(logger);

const cors = require('cors');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
require('./connection');

// CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // This ensures all relevant HTTP requests are received by backend
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
  });

const server = require('http').createServer(app);
const PORT = 5001

// Initializing middleware
app.use(logger);

server.listen(PORT, () => {
    console.log('listening to port ', PORT)
})