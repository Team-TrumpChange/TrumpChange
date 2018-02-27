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
    tweet_mode: 'extended'
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
          //!err ? console.log('Successful update of retweets and favorites') : console.log('Error updating retweets and favorites');
        })
      }
    }, count);
  });
}

function saveUserIntoDataBase(username, password, email, maxWeeklyPlans, totalMoneyDonated, callback) {
  db.User.findOne({username: username}, function(err, result) {
    if (result === null) {
      db.User.findOne({email: email}, function(error, emailLookUpResult) {
        if (emailLookUpResult === null) {
          const newUser = new db.User({ username: username, password: password, customerID: null, subscriberID: null, email: email, maxWeeklyPlans: maxWeeklyPlans, totalMoneyDonated: totalMoneyDonated, newUser: true });
          newUser.save(() => {
            callback('User saved in saveUserIntoDataBase');
          });
        } else if (error) {
          callback('Error on looking up email in database');
        } else {
          callback('Email already exists');
        }
      })
    } else if (err) {
      callback('Error on looking up user in database');
    } else {
      callback('Username already exists');
    }
  });
}

function checkPassword(username, password) {
  console.log(password)
  return db.User.findOne({username: username})
  .then(doc => {
    console.log('THE DOC:', doc);
    console.log('password in checkPassword:', password);
    return bcrypt.compareSync(password, doc.password, (err, res) => {
      return res;
    });
  })
  .catch(error => {
    console.log(error);
  })
}

function saveTweetIntoDataBase(avatar, tweetid, username, name, tweet, favorites, retweets, dateTweeted) {
  const newTweet = new db.Tweet({ avatar: avatar, tweetid: tweetid, username: username, name: name, tweet: tweet, favorites: favorites, retweets: retweets, dateTweeted: dateTweeted, dateObject: moment(dateTweeted).toDate()});
  newTweet.save((err) => {
    console.log('tweet saved');
  })
}

function hashPassword(userObj) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(userObj.password, salt);
  userObj.password = hash;
}

function addSubscriberIDAndCustomerID(subid, custid, username, callback) {
  console.log('id:', subid);
  console.log('username:', username);
  db.User.findOne({username: username})
    .then(function(doc) {
      doc.subscriberID = subid;
      doc.customerID = custid
      console.log('doc.subscriberID:', doc.subscriberID)
      console.log('doc.customerID:', doc.customerID);
      doc.save(function(err) {
          if (err) {
            console.log('error saving subsriptionID');
          } else {
            callback();
          }
      });
    })
    .catch(error => {
      console.log('error finding user in helpers.addSubscriberID:', error);
      
    })
}

function addUniqueTweet(tweetsArray) {
  for (let tweet of tweetsArray) {
    db.Tweet.find({ tweetid: tweet.id}, (err, res) => {
      if (!res.length) {
        saveTweetIntoDataBase(tweet.user.profile_image_url_https, tweet.id, tweet.user.screen_name, tweet.user.name, tweet.full_text, tweet.favorite_count, tweet.retweet_count, tweet.created_at);
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
      callback(results);
   })
   .catch(error => {
     console.log('error finding all users in helpers.updateSubscriptions:', error);
     
   })
}

function updateUserAmountDonated(numDonations, user, callback) { // takes in the amount donated that week and adds it to the total in their table row
  console.log('user in updateUser:', user);
  db.User.findOne({username: user.username})
    .then(function(user) {
      user.totalMoneyDonated = user.totalMoneyDonated + numDonations;
      user.save(err => {
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

function updateTotalDonated(weeklyCount, callback) {
  db.GlobalVariable.findOne({name: 'totalDonated'})
    .then(result => {
      console.log('result.value before adding weeklyCount (inside updateTotalDonated):', result.value);
      result.value = (Number(result.value) + Number(weeklyCount)).toString();
      console.log('result.value after adding weeklyCount (inside updateTotalDonated):', result.value);
      result.save(err => {
        if (err) {
          console.log('error saving updateTotalDonated after adding weeklyCount', err);
          callback(err);
        } else {
          console.log('success saving updateTotalDonated');
          callback();
        }
      })
    })
    .catch(err => {
      console.log('error finding totalDonated globalVariable in updateTotalDonated');
      callback(err);
    });
}

function getTotalDonated(callback) {
  db.GlobalVariable.findOne({name: 'totalDonated'})
    .then(result => {
      console.log('result.value from findONe in getTotalDonated:', result.value);
      callback(null, result.value);
    })
    .catch(err => {
      callback(err);
    });
}

function getTotalUsers(callback) {
  db.User.count({})
    .then(result => {
      console.log('User count from getTotalUsers:', result);
      callback(null, result.toString());
    })
    .catch(err => {
      console.log('error getting user count in getTotalUsers', err);
      callback(err);
    })
}

function getTotalNumTweets(callback) {
  db.Tweet.count({})
    .then(result => {
      console.log('Num of Tweets from getTotalNumTweets:', result);
      callback(null, result.toString());
    })
    .catch(err => {
      console.log('error getting totalNumTweets in getTotalNumTweets:', err);
      callback(err);
    });
}

function getUserProfile(username, callback) {
  db.User.findOne({username: username})
    .then(result => {
      console.log('result from find in getUserProfile:', result);
      callback(null, result);
    })
    .catch(err => {
      console.log('error in getUserProfile:', err);
      callback(err);
    })
}

function getBillingCycleMoment(callback) {
  db.GlobalVariable.findOne({name: 'billCycleMoment'})
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log('error getting getBillingCycleMoment:', err);
      callback(err);
    })
}


exports.updateRetweetAndFavoriteCount = updateRetweetAndFavoriteCount;  
exports.addUniqueTweet = addUniqueTweet;
exports.getTweets = getTweets;
exports.saveUserIntoDataBase = saveUserIntoDataBase;
exports.saveTweetIntoDataBase = saveTweetIntoDataBase;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.getTrumpTweets = getTrumpTweets;
exports.addSubscriberIDAndCustomerID = addSubscriberIDAndCustomerID;
exports.updateSubscriptions = updateSubscriptions;
exports.updateUserAmountDonated = updateUserAmountDonated;
exports.updateTotalDonated = updateTotalDonated;
exports.getTotalDonated = getTotalDonated;
exports.getTotalUsers = getTotalUsers;
exports.getTotalNumTweets = getTotalNumTweets;
exports.getUserProfile = getUserProfile;
exports.getBillingCycleMoment = getBillingCycleMoment;
