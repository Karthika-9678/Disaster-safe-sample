const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  phone: String
});

module.exports = mongoose.model('PoliceStation', policeStationSchema);
