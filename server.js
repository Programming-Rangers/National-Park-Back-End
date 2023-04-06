'use strict';

//Express for REST
const express = require('express');

const app = express();

require('dotenv').config();

//Axios for API
const axios = require('axios');

//CORS for middleware
const cors = require('cors');

//MONGOOSE LIBRARY 
const mongoose = require('mongoose');

// Apply Middleware
app.use(cors());

//Body Parser
app.use(express.json());

//Require Park Model
const Park = require('./models/park.js');

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



app.get('/activities', getActivities);

async function getActivities(request, response, next) {
  try {
    let url = `https://developer.nps.gov/api/v1/activities?api_key=${process.env.NPS_API_KEY}`;

    let activitiesResults= await axios.get(url);
    console.log(activitiesResults.data.data);

    let activitiesToSend = activitiesResults.data.data;

    response.status(200).send(activitiesToSend);

  } catch (error) {
      next(error);
  }
}


app.get('/activityParks', getActivityParks)

async function getActivityParks(request, response, next) {
  try {

    let activityID = request.query.activityID;

    let url = `https://developer.nps.gov/api/v1/activities/parks?api_key=${process.env.NPS_API_KEY}&id=${activityID}`;

    let activityParkResults= await axios.get(url);

    let activityParksToSend = activityParkResults.data.data[0].parks.map(obj => new ActivityParks(obj));

    response.status(200).send(activityParksToSend);

  } catch (error) {
      next(error);
  }
}

class ActivityParks {
  constructor(obj) {
  this.locations = obj.states;
  this.name = obj.fullName;
  this.parkCode = obj.parkCode;
  this.url = obj.url;
  }
}

app.get('/descriptionImages', getDescriptionImages);

async function getDescriptionImages(request, response, next) {
  try {

    let parkCode = request.query.parkCode;

    let url = `https://developer.nps.gov/api/v1/parks?api_key=${process.env.NPS_API_KEY}&parkCode=${parkCode}`;

    let ParkResults= await axios.get(url);

    // let ParkInfoToSend = ParkResults.data.map(obj => new DescriptionImages (obj));

    let ParkInfoToSend = new DescriptionImages (ParkResults.data.data[0]);

    response.status(200).send(ParkInfoToSend);

  
  } catch (error) {
      next(error);
  }
}

class DescriptionImages {
  constructor(obj) {
  this.images = obj.images;
  this.description = obj.description;
  this.weather = obj.weatherInfo;
  }
}

//Read functionality
app.get('/parks', getParks);

async function getParks(request, response, next){
  try{

    let allParks = await Park.find({});

    response.status(200).send(allParks);

  } catch(error) {
    console.error(error);
    next(error);
  }
}

//CREATE functionality

app.post('/parks', postParks);

async function postParks (request, response, next) {
  try{
    let userParks = await Park.create(request.body);

    response.status(201).send(userParks);

  } catch (error) {
    console.error(error);
    next(error);
  }
}

//UPDATING functionality
app.put('/parks/:parkID', updateParks);

async function updateParks (request, response, next){
  try {
    let id = request.params.parkID;
    let data = request.body;

    const updatedParks = await Park.findByIdAndUpdate(id,data,{new: true,overwrite: true});

    response.status(200).send(updatedParks);

  } catch(error) {
    next(error);
  }
}

//DELETING functionality

app.delete('/parks/:parkID', deleteParks);

async function deleteParks(request,response, next){
  try {
    let id = request.params.parkID;

    await Park.findByIdAndUpdate(id);

    response.status(200).send('Park deleted successfully!');

  } catch (error) {
    next(error);
  }
}


app.get('*', (request, response) => {
  response.status(404).send('Not Found!');
});

//ERRORS
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});