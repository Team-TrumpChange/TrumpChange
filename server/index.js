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

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.MONGO_DATABASE);
app.use(session({
  secret: 'nerfgun',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

let count = 0;
let billCycleMoment = 'Thu Feb 22 15:30 +0000 2018';

setInterval(() => {
  helpers.getTweets(tweets => {   
    helpers.addUniqueTweet(tweets)
  })
}, 60000);

function sessionCleanup() {
  sessionStore.all(function (err, sessions) {
    for (var i = 0; i < sessions.length; i++) {
      sessionStore.get(sessions[i], function () { });
    }
  });
}

var updateSubs = function(count) {
  helpers.updateSubscriptions(function (users) {
    console.log('in updateSubscriptions');

    var subroutine = function(user, index) {
      var updateNum;
      console.log('user:', user);
      if (user.maxWeeklyPlans <= count) {
        updateNum = user.maxWeeklyPlans;
      } else {
        updateNum = count;
      }
      if (user.subscriberID) {
        console.log('updateNum:', updateNum);
        console.log('user.subscriberID:', user.subscriberID);

        stripe.subscriptions.update(
          user.subscriberID,
          {quantity: updateNum} , function(err, user) {
            if (err) {
              console.log('error updating user', err);
            } else {
              console.log('user updated, user.quantity:', user.quantity);
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
setInterval(() => {
  const now = moment.tz("Europe/London").format("ddd MMM DD HH:mm ZZ YYYY");
  if (now === billCycleMoment) {
    console.log('BILLING!!');
    const sevenDaysAgo = moment(now, "ddd MMM DD HH:mm ZZ YYYY").subtract(7, 'd').tz("Europe/London").format("ddd MMM DD HH:mm ZZ YYYY");
    console.log('seven days ago from this very moment', sevenDaysAgo);
    db.Tweet.count({ dateTweeted: { $gt: sevenDaysAgo } }, (err, res) => {
      count = res;
      updateSubs(count);
    })
    billCycleMoment = moment(billCycleMoment, "ddd MMM DD HH:mm ZZ YYYY").tz("Europe/London").add(7, 'd').format("ddd MMM DD HH:mm ZZ YYYY"); 
    console.log('7 days from this very moment', billCycleMoment);
  }
}, 60000);

app.get('/')

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
          res.send('error loggin user in after saving to DB');
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
  //console.log('db.checkPassword', helpers.checkPassword);
  helpers.checkPassword(req.body.username, req.body.password, function(boolean) {
  console.log('yoooooooo',req.body.password)
    if (boolean) {
      req.session.regenerate(function(err) {
        if (!err) {
          req.session.username = req.body.username;
          console.log('login succesful, session created');
          console.log(req.session);
          res.send(req.session.username);
        } else {
          console.log('error creating session');
        }
      });
      //req.session = null;
      // req.session.username = req.body.username
      // res.send(req.session.username)
    } else {
      console.log('invalid credentials');
      res.send('invalid credentials');
    }
  });
});


app.get('/getTrumpTweets/db', (req, res) => {
  helpers.getTrumpTweets(function(results) {
    res.json(results)
  })
})

app.post('/customerToken', function(req, res) { // this will receive customer token
 // here need to use helper functions(from stripe) to create a new customer and create new subscription
 const tokenId = req.body.id;
 const email = req.body.email;
 // console.log('token.card.name:', token.card.name);
 console.log('TOKENID:', tokenId);
 console.log('email', email);
 console.log('req.session.username:', req.session.username);

 // *check if token email matches db email 


 if (req.session.user) {
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
           stripe.subscriptions.create({ // creates a new subscription
               customer: customer.id,
               items: [
                {
                  plan: 'plan_CM50jYu8LYbvMC',
                  quantity: 0
                }
               ],
           }, function(err, subscription) { // returns a subscription object
               if (err) {
                 console.log('error creating subscription:', err);
                 res.send('error')
               } else {
                 console.log('saved subscription:', subscription);
                 // here save the subscription to the db - use customer id and email so it can be found in db and added to user file
                 helpers.addSubscriberID(subscription.id, req.session.username, function() {
                   console.log('subsciprtionIDSaved');
                   res.send('success saving subscription');
                 });
               }
           });
      }
   })
  } else {
    res.send('error creating new account, subscription not created');
  }
});

app.post('/updateCounter', function(req, res) { // receives a post from front end to update the user's max count
 // uses db function to update that user's max count
});

app.post('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log('error logging out');
    }
    else {
      console.log('session destroyed!');
    }
  });
})

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});