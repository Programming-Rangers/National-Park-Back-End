'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

//***REQUIRE IN OUR MONGOOSE LIBRARY */
const mongoose = require('mongoose');

// Apply Middleware
app.use(cors());

//Body Parser
app.use(express.json());

//Define Port
const PORT = process.env.PORT || 3002;

//LISTEN through PORT
app.listen(PORT, () => console.log(`listening on Port ${PORT}`));

//Connect Mongoose

mongoose.connect(process.env.DB_URL);

//Troubleshooting in Terminal for Mongoose
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Mongoose is connected');
  // require('./seed.js');
});

//ENDPOINT TO GET

app.get('/', (request, response) => {

  response.status(200).send('Welcome!');
});


app.get('*', (request, response) => {
  response.status(404).send('Not Found!');
});

//ERRORS
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});