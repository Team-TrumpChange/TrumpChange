const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const helpers = require('../helpers/backend-helpers');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const moment = require('moment');
const timezone = require('moment-timezone');
const app = express();

app.use(express.static(__dirname + '/../client/dist/'));
//app.use(cookieParser('nerfgun'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.MONGO_DATABASE);
app.use(session({
  secret: 'nerfgun',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 60 })
}));


setInterval(() => {
  helpers.updateRetweetAndFavoriteCount();
}, 30000);

setInterval(() => {
  helpers.getTweets(tweets => {   
    helpers.addUniqueTweet(tweets);
  })
}, 60000);

//do we need this?
function sessionCleanup() {
  sessionStore.all(function (err, sessions) {
    for (var i = 0; i < sessions.length; i++) {
      sessionStore.get(sessions[i], function () { });
    }
  });
}

var updateSubs = function(count) { // this function updates Subscriptions but also calls function to update userAmountDonated and totalAmountDonated
  helpers.updateSubscriptions(function (users) {
    console.log('in updateSubscriptions');

    var subroutine = function(userProfile, index) {
      var udpated = false;
      var updateNum;
      console.log('userProfile:', userProfile);
      if (userProfile.maxWeeklyPlans <= count) {
        updateNum = userProfile.maxWeeklyPlans;
      } else {
        updateNum = count;
      }

      if (userProfile.subscriberID && !userProfile.newUser && !userProfile.canceled) {
        console.log('updateNum:', updateNum);
        console.log('userProfile.subscriberID:', userProfile.subscriberID);

        stripe.subscriptions.update( // then update the number of plans for each user in stripe DB
          userProfile.subscriberID,
          {quantity: updateNum} , function(err, user) {
            if (err) {
              console.log('error updating user', err);
            } else {
              console.log('user updated, user.quantity:', user.quantity);
              helpers.updateUserAmountDonated(updateNum, userProfile, function(err) {
                if (!err) {
                  if (index === users.length) { // base case
                    return;
                  }
                  helpers.updateTotalDonated(updateNum, function(err) { // update totalDonated
                    if (!err) {
                      console.log('about to call next subroutine');
                      subroutine(users[index], index + 1);      
                    } else {
                      console.log('error updating total donating, about to call next subroutine to move onto updating next user sub');
                      subroutine(users[index], index + 1); // even if updateTotalDonated goes wrong, still go onto updating next user sub
                    }
                  })
                } else {
                  console.log('error in updatingUserAmountDonated (inside updateSubs), about to call next subroutine anyway:', err);
                  subroutine(users[index], index + 1); // move onto next user, if one doesnt update correctly, still do the rest
                }
              });    
            }
        });
      } else if (userProfile.subscriberID) {
        console.log('in the else if server/index line 96');
        userProfile.newUser = false;
        userProfile.save(err => {
          if (err) {
            console.log('error resaving user after changing newUser to false in updateSubs:', err);
            subroutine(users[index], index + 1);
          } else {
            console.log('userProfile.newUser:', userProfile.newUser);
            if (index === users.length) {
              return;
            }
            subroutine(users[index], index + 1);
          }
        });
      } else {
        if (index === users.length) {
          return;
        }
        subroutine(users[index], index + 1);
      }
    } 

    subroutine(users[0], 1);
  });
}

//counts tweets every week
setInterval(() => { // also calls update subscriptions in line 136
  const now = moment.tz("Europe/London").format("ddd MMM DD HH:mm ZZ YYYY");
  console.log('now in setInterval:', now)
  helpers.getBillingCycleMoment((err, result) => {
    if (err) {
      console.log('error getting getBillingCycleMoment in counting weekly tweets');
    } else {
      let billCycleMoment = result.value;
      console.log('billCycleMoment:', billCycleMoment);
      if (now === billCycleMoment) {
        console.log('billCycleMoment in setInterval(server):', billCycleMoment); // move this down
        console.log('BILLING!!');
        const sevenDaysAgo = moment(now, "ddd MMM DD HH:mm ZZ YYYY").subtract(7, 'd').tz("Europe/London").format("ddd MMM DD HH:mm ZZ YYYY");
        console.log('seven days ago from this very moment', sevenDaysAgo);
        db.Tweet.count({ dateTweeted: { $gt: sevenDaysAgo } }, (err, res) => {
          let count = res;
          billCycleMoment = moment(billCycleMoment, "ddd MMM DD HH:mm ZZ YYYY").add(7, 'd').tz("Europe/London").format("ddd MMM DD HH:mm ZZ YYYY"); 
          console.log('7 days from this very moment', billCycleMoment);
          helpers.getBillingCycleMoment((err, result) => {
            if (err) {
              res.status(400).send('error updating the billCycleMoment in DB');
            } else {
              result.value = billCycleMoment;
              result.save(err => {
                if (err) {
                  console.log('error saving updated billCycleMoment in DB');
                }
                updateSubs(count); // calls update subscriptions
              })
            }
          });
        })
      }
    }
  })
}, 60000);


app.post('/createAccount', function(req, res) { // receives new account info from client and saves it to db. also creates a session
  helpers.hashPassword(req.body)
  req.body.totalMoneyDonated = null;
  const {
    username: username,
    password: password,
    email: email,
    maxWeeklyPlans: maxWeeklyPlans,
    totalMoneyDonated: totalMoneyDonated
  } = req.body;  
  
  helpers.saveUserIntoDataBase(username, password, email, maxWeeklyPlans, totalMoneyDonated, function (message) {
    if (!password || !username || !maxWeeklyPlans) {
      res.send('Must enter valid username, password, and maxWeeklyPlans!');
    } else if (message) {
      res.send(message);
    } else {
      req.session.regenerate(function(err) {
        if (!err) {
          req.session.username = username;
          res.send(req.session.username);
        } else {
          console.log('error creating session');
          res.status(400).send('error loggin user in after saving to DB');
        }
      });
      // req.session = null;
      // req.session.username = username
      // res.send(req.session.username)
    }
  });
});

app.post('/login', function(req, res) { // receives login information from front end
 // calls db functions to authenticate credentials
   // use mongoose find function with username 
   // check the password in db against submitted password
  console.log('req.body.username:', req.body.username);
  console.log('req.body.password:', req.body.password);
  db.User.findOne({username: req.body.username}).exec((err, response) => {
    if (response) {
      helpers.checkPassword(req.body.username, req.body.password)
        .then((boolean) => {
          if (boolean) {
            req.session.regenerate(err => {
              if (!err) {
                req.session.username = req.body.username;
                console.log('login succesful, session created');
                console.log(req.session);
                res.status(202).send(req.session.username);
              } else {
                console.log('error creating session');
              }
            })
          } else {
            res.status(200).send('password does not match');
          }
        })
    } else {
      res.status(200).send('user not found');
    }
  });
});

app.get('/getTrumpTweets/db', (req, res) => {
  helpers.getTrumpTweets(function(results) {
    res.json(results)
  })
});


app.get('/stats', (req, res) => { // handles get request from front end for the total donated
  let stats = {};
  helpers.getTotalDonated(function(err, result) {
    if (err) {
      res.send('error retrieving totalDonated');
    } else {
      stats.totalDonated = result;
      // here call other funcs to get other stats
      helpers.getTotalUsers(function(err, result) {
        if (err) {
          stats.totalUsers = 'error';
          res.send(stats);
        } else {
          stats.totalUsers = result;
          helpers.getTotalNumTweets(function(err, result) {
            if (err) {
              stats.totalNumTweets = 'error';
            } else {
              stats.totalNumTweets = result;
              res.send(stats);
            }
          })
        }
      })
      // res.send(result);
    }
  })
});

app.post('/userProfile', (req, res) => {
  helpers.getUserProfile(req.body.username, function(err, result) {
    if (err) {
      res.status(400).send('error getting user stats');
    } else {
      res.send(result);
    }
  })
});


app.post('/customerToken', function(req, res) { // this will receive customer token
 // here need to use helper functions(from stripe) to create a new customer and create new subscription
 const tokenId = req.body.id;
 const email = req.body.email;
 // console.log('token.card.name:', token.card.name);
 console.log('TOKENID:', tokenId);
 console.log('email', email);
 console.log('req.username:', req.body.username);

 // *check if token email matches db email 


 if (req.body.username) {
   stripe.customers.create({
  // the id from the token object sent from front end
       source: tokenId,
       email: email
   }, function(err, customer) { // returns a customer object if successful
      if (err) {
          console.log('error in create function')
          res.send('error');
      } else {
          console.log('customer.id:', customer.id);
          console.log('customer.email:', customer.email);
          console.log(customer)
        // console.log(customer)
        helpers.getBillingCycleMoment((err, result) => {
          if (err) {
            res.status(400).send('error creating new billing cycle anchor, subscription not created');
          } else {
            var billingCycleMoment = Number(moment(result.value, "ddd MMM DD HH:mm ZZ YYYY").tz("Europe/London").add(5, 'm').format('X'));
            console.log('billCycleMoment + 5 min (before creating subscription):', billingCycleMoment);
            console.log('typeof billCycleMoment,', typeof billingCycleMoment);
             stripe.subscriptions.create({ // creates a new subscription
                 customer: customer.id,
                 items: [
                  {
                    plan: 'plan_CM50jYu8LYbvMC',
                    quantity: 0
                  }
                 ],
                 billing_cycle_anchor: billingCycleMoment
             }, function(err, subscription) { // returns a subscription object
                 if (err) {
                   console.log('error creating subscription:', err);
                   res.send('error')
                 } else {
                   console.log('saved subscription:', subscription);
                   // here save the subscription to the db - use customer id and email so it can be found in db and added to user file
                   helpers.addSubscriberIDAndCustomerID(subscription.id, customer.id, req.body.username, function() {
                     console.log('subsciprtionIDSaved');
                     res.send('success saving subscription');
                   });
                 }
             });
          }
        })
      }
   })
  } else {
    res.send('error creating new account, subscription not created');
  }
});

// app.post('/updateCounter', function(req, res) { // receives a post from front end to update the user's max count
//  // uses db function to update that user's max count
// });

app.post('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log('error logging out');
      res.send();
    }
    else {
      console.log('session destroyed!');
      res.send();
    }
  });
}); 

app.post('/cancelSubscription', (req, res) => {
  helpers.getUserProfile(req.body.username, (err, result) => {
    if (err) {
      res.send('error canceling subscription, couldnt find user');
    } else {
      console.log('result.subscriberID:', result.subscriberID);
      stripe.subscriptions.del(result.subscriberID)
        .then(() => {
          result.canceled = true;
          result.save((err) => {
            if (err) {
              console.log('subscription canceled, but error updating user profile subscription as canceled');
              res.send('subscription canceled, but error updating user profile accordingly');
            }
              res.send('subscription canceled');
          })
        })
        .catch(err => {
          res.send('error canceling subscription');
        });
    }
  });
});

app.post('/changeUserInfo', (req, res) => {
  helpers.getUserProfile(req.body.username, (err, result) => {
    if (err) {
      res.send('error updating user Profile, couldnt find profile');
    } else {
      if (req.body.newName) {
        result.username = req.body.newName
      } 
      if (req.body.maxWeeklyPlans) {
        result.maxWeeklyPlans = req.body.maxWeeklyPlans
      }
      result.save(err => {
        if (err) {
          console.log('error saving updated user info');
          res.send('error saving updated user info');
        } else {
          console.log('success saving updated user info');
          res.send(result);
        }
      });
    }
  })
});

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});