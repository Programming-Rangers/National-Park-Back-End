'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ParkSchema = new Schema ({
  parkName: { type: String, required: true },
  location: { type: String, required: true },
  parkWebsite: { type: String, required: true },
  parkMedia: { type: String, required: true },
  parkCommentary: {type: String, required: false },
  parkVisited: { type: Boolean, required: false }
 });


const Park = mongoose.model('park', ParkSchema);

module.exports = Park;
