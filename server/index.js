const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const helpers = require('../helpers/backend-helpers');


const app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());

app.get('/fetchtweets', (req, res) => {
  const { user } = req.query.user;
  helpers.getTweets(user, (tweets) => {
    res.send(tweets);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port 3000!');
});