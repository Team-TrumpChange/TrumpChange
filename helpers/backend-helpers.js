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

function getTweets(callback) {
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

function saveUserIntoDataBase(username, password, email, maxWeeklyPlans, totalMoneyDonated) {
  const newUser = new db.User({ username: username, password: password, subscriberID: null, email: email, maxWeeklyPlans: maxWeeklyPlans, totalMoneyDonated: totalMoneyDonated });
  newUser.save(() => {
    console.log('user saved');
  })
}


function checkPassword(username, password, callback) {
  db.User.findOne({username: username})
    .then(function(doc) {
      console.log('password', password);
      console.log('callback:', callback);
      callback(bcrypt.compareSync(password, doc.password));
    });

function saveTweetIntoDataBase(tweetid, username, tweet, dateTweeted) {
  const newTweet = new db.Tweet({ tweetid: tweetid, username: username, tweet: tweet, dateTweeted: dateTweeted});
  newTweet.save(() => {
    console.log('tweet saved');
  })

}

function hashPassword(userObj) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(userObj.password, salt);
  userObj.password = hash;
};

function addUniqueTweet(tweetsArray) {
  for (let tweet of tweetsArray) {
    db.Tweet.find({ tweetid: tweet.id}, (err, res) => {
      if (!res.length) {
        saveTweetIntoDataBase(tweet.id, tweet.user.screen_name, tweet.text, tweet.created_at);
      }
    })
  }
}

function getTrumpTweets(callback) {
  db.Tweet.find({}, function(err, results){
    if (err) console.log(err)
    else {
      callback(results)
    }
  }) 
}



exports.addUniqueTweet = addUniqueTweet;
exports.getTweets = getTweets;
exports.saveUserIntoDataBase = saveUserIntoDataBase;
exports.saveTweetIntoDataBase = saveTweetIntoDataBase;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.getTrumpTweets = getTrumpTweets;
