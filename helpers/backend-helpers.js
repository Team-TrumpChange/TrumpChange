const Twitter = require('twitter');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const db = require('../database/index.js');

dotenv.config();

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function getTweets(user, callback) {
  const params = {
    screen_name: 'realdonaldtrump',
    count: 5,
  };

  twitterClient.get('statuses/user_timeline', params, (error, tweets) => {
    if (!error) {
      callback(tweets);
    } else {
      callback(error);
    }
  });
}


function saveIntoDataBase(username, password, email, maxWeeklyPlans, totalMoneyDonated) {
  const newUser = new db.User({ username: username, password: password, email: email, maxWeeklyPlans: maxWeeklyPlans, totalMoneyDonated: totalMoneyDonated });
  newUser.save(() => {
    console.log('user saved');
  })
}

function hashPassword(userObj) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(userObj.password, salt);
  userObj.password = hash;
};

function getTrumpTweets(callback) {
  db.Tweet.find({}, function(err, results){
    if (err) console.log(err)
    else {
      callback(results)
    }
  }) 
}



exports.getTweets = getTweets;
exports.saveIntoDataBase = saveIntoDataBase;
exports.hashPassword = hashPassword;
exports.getTrumpTweets = getTrumpTweets
