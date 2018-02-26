const Twitter = require('twitter');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const db = require('../database/index.js');
const moment = require('moment');

dotenv.config();

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function getTweets(callback, count) {
  const params = {
    screen_name: 'realdonaldtrump',
    count: count || 5,
  };
  twitterClient.get('statuses/user_timeline', params, (error, tweets) => {
    if (!error) {
      callback(tweets);
    } else {
      callback(error);
    }
  });
}

function updateRetweetAndFavoriteCount() {
  db.Tweet.count({}, (err, count) => {
    getTweets(tweets => {
      for (let tweet of tweets) {
        db.Tweet.update({ tweetid: tweet.id }, { $set: { favorites: tweet.favorite_count, retweets: tweet.retweet_count}}, (err, res) => {
          !err ? console.log('Successful update of retweets and favorites') : console.log('Error updating retweets and favorites');
        })
      }
    }, count);
  })
}

function saveUserIntoDataBase(username, password, email, maxWeeklyPlans, totalMoneyDonated, callback) {
  db.User.findOne({username: username}, function(err, result) {
    if (result === null) {
      const newUser = new db.User({ username: username, password: password, subscriberID: null, email: email, maxWeeklyPlans: maxWeeklyPlans, totalMoneyDonated: totalMoneyDonated });
      newUser.save(() => {
        console.log('user saved in saveUserIntoDataBase');
        callback();
      });
    } else if (err) {
      callback('error');
    } else {
      callback('Username already exists!');
    }
    
  })
}

function checkPassword(username, password, callback) {
  console.log('username in checkPassword:', username);
  console.log('password in checkPassword:', password);
  db.User.findOne({username: username})
    .then(function(doc) {
      if (doc === null) {
        callback(false);
      }
      console.log('password in checkPassword:', password);
      callback(bcrypt.compareSync(password, doc.password));
    })
    .catch(error => {
      console.log(error);
    })
}

function saveTweetIntoDataBase(avatar, tweetid, username, name, tweet, favorites, retweets, dateTweeted) {
  const newTweet = new db.Tweet({ avatar: avatar, tweetid: tweetid, username: username, name: name, tweet: tweet, favorites: favorites, retweets: retweets, dateTweeted: dateTweeted, dateObject: moment(dateTweeted).toDate()});
  newTweet.save(() => {
    console.log('tweet saved');
  })
}

function hashPassword(userObj) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(userObj.password, salt);
  userObj.password = hash;
}

function addSubscriberID(id, username, callback) {
  console.log('id:', id);
  console.log('username:', username);
  db.User.findOne({username: username})
    .then(function(doc) {
      doc.subscriberID = id;
      console.log('doc.subscriberID:', doc.subscriberID)
      doc.save(function(err) {
          if (err) {
            console.log('error saving subsriptionID');
          } else {
            callback();
          }
      });
    })
    .catch(error => {
      console.log(error);
      
    })
}

function addUniqueTweet(tweetsArray) {
  for (let tweet of tweetsArray) {
    db.Tweet.find({ tweetid: tweet.id}, (err, res) => {
      if (!res.length) {
        saveTweetIntoDataBase(tweet.user.profile_image_url_https, tweet.id, tweet.user.screen_name, tweet.user.name, tweet.text, tweet.favorite_count, tweet.retweet_count, tweet.created_at);
      }
    })
  }
}

function getTrumpTweets(callback) {
  db.Tweet.find({}).sort({ dateObject: -1 }).exec((err, res) => {
    if (err) {
      return console.log(err)
    }
    callback(res);
  });
}

function updateSubscriptions(callback) {
  db.User.find({})
    .then(function(results) {
      console.log('results:', results);
      console.log('callback:', callback);
      callback(results);
   })
   .catch(error => {
     console.log(error);
     
   })
}

function updateUserAmountDonated(numDonations, user, callback) { // takes in the amount donated that week and adds it to the total in their table row
  console.log('user in updateUser:', user);
  db.User.findOne({username: user.username})
    .then(function(user) {
      user.totalMoneyDonated = user.totalMoneyDonated + numDonations;
      user.save(function(err) {
        if (err) {
          console.log('error updating totalMondayDonated for user:', user, error);
          callback(err);
        } else {
          console.log('success updating totalMoneyDonated for user:', user);
          callback();
        }
      });
    })  
    .catch(function(err) {
      console.log('error finding the user in updateUserAmountDonated', err);
      callback(err);
    });
}

exports.updateRetweetAndFavoriteCount = updateRetweetAndFavoriteCount;  
exports.addUniqueTweet = addUniqueTweet;
exports.getTweets = getTweets;
exports.saveUserIntoDataBase = saveUserIntoDataBase;
exports.saveTweetIntoDataBase = saveTweetIntoDataBase;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.getTrumpTweets = getTrumpTweets;
exports.addSubscriberID = addSubscriberID;
exports.updateSubscriptions = updateSubscriptions;
exports.updateUserAmountDonated = updateUserAmountDonated;
