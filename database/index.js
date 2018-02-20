const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helpers = require('../helpers/backend-helpers.js')
dotenv.config();
const db = mongoose.connect(process.env.MONGO_DATABASE);

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  maxWeeklyPlans: Number,
  totalMoneyDonated: Number
});

let User = mongoose.model('User', userSchema);

exports.User = User;