const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helpers = require('../helpers/backend-helpers.js')
dotenv.config();
const db = mongoose.connect(process.env.MONGO_DATABASE);

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  subscriberID: String,
  email: String,
  maxWeeklyPlans: Number,
  totalMoneyDonated: Number
});

let tweetsSchema = mongoose.Schema({
  avatar: String,
  tweetid: String,
  username: String,
  name: String,
  tweet: String,
  favorites: Number,
  retweets: Number,
  dateTweeted: String
});

let User = mongoose.model('User', userSchema);
let Tweet = mongoose.model('Tweet', tweetsSchema);

exports.User = User;
exports.Tweet = Tweet;
