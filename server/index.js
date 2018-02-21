const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const helpers = require('../helpers/backend-helpers');
const config = require('../config.js');
const cors = require('cors');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const session = require('express-session');

const app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


setInterval(() => {
  helpers.getTweets(tweets => {   
    helpers.addUniqueTweet(tweets)
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
  
  helpers.saveUserIntoDataBase(username, password, email, maxWeeklyPlans, totalMoneyDonated, function () {
    // need to create session here
    req.session.regenerate(function(err) {
      if (!err) {
        req.session.username = username;
        res.send(req.session.username);
      } else {
        console.log('error creating session');
      }
    });
  });
});

app.post('/login', function(req, res) { // receives login information from front end
 // calls db functions to authenticate credentials
   // use mongoose find function with username 
   // check the password in db against submitted password
   console.log('db.checkPassword', helpers.checkPassword);
  helpers.checkPassword(req.body.username, req.body.password, function(boolean) {
    if (boolean) {
      req.session.regenerate(function(err) {
        if (!err) {
          req.session.username = req.body.username;
          res.send(req.session.username);
        } else {
          console.log('error creating session');
        }
      });
    } else {
      console.log('invalid credentials');
      res.send('invalid credentials');
    }
  });
});




app.post('/update', function(req, res) {
  var quantity = req.body.quantity
  stripe.subscriptions.update(
    'sub_CMPiQx0TXTMCnE',
    { quantity: quantity },
    function(err, subscription) {
      // asynchronously called
      if (err) {
        console.log('error', err)
      } else {
        console.log('updated')
      }
    }
  );
});


app.get('/getTrumpTweets/db', (req, res) => {
  helpers.getTrumpTweets(results => {
    res.send(results)
  })
})



app.post('/customerToken', function(req, res) { // this will receive customer token
 // here need to use helper functions(from stripe) to create a new customer and create new subscription
 const tokenId = req.body.id;
 const email = req.body.email;
 // console.log('token.card.name:', token.card.name);
 console.log('TOKENID:', tokenId);
 console.log('email', email);



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
               helpers.addSubscriberID(subscription.id, email, function() {
                 console.log('subsciprtionIDSaved');
                 res.send('success saving subscription');
               });
             }
         });
    }
 })
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

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port 3000!');
});
