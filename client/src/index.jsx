import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import config from '../../config.js'
import StripeCheckout from 'react-stripe-checkout'
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config();

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      tweets: []
    }
    this.onToken = this.onToken.bind(this)
    this.update = this.update.bind(this)
  }

  getFiveTweetsEveryHalfMinute() {
    const context = this;
    console.log('Pressed');
    setInterval(function() {
      context.getTweets();
    },30000)
  }

  checkForNewTweets(data) { // compares last tweet of this.props.tweets to the incoming data to see if new tweet
    if (data[data.length - 1].id && data[data.length - 1].id === this.state.tweets[this.state.tweets.length - 1].id) {
      return true;
    }
    return false;
  }

  getTweets() { // gets new tweets from server (server does api call to twitter)
    const context = this;
    axios.get('/fetchtweets', {
      params: {
        user: 'realdonaldtrump'
      }
    })
      .then((res) => {
        console.log('Success');
        console.log(res.data)

        if (context.checkForNewTweets(data)) { // checks if the last tweet is new and resets the state
          context.setState({
            tweets: res.data
          });
        }
        res.data.forEach((element) => {
          console.log(element.text);
        })    
      })
      .catch((error) => {
        console.log('Error:', error);
      })
  }

  componentDidMount() {
    // console.log('processenv:',process.env, 'config:', config.STRIPE_PUBLISHABLE_KEY )
  }

  onToken(token) { // creates a new token when user clicks on pay with card, sends it to server
    console.log('onToken', token)
    axios.post('/customerToken', {
      id: token.id,
      email: token.card.name
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  update() {
    axios.post('/update', {
      quantity: 10
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
  

  // onToken(token) {
  //   console.log('onToken', token)
  //   fetch('/customerToken', {
  //     method: 'POST',
  //     body: JSON.stringify(token),
  //   }).then(response => {
  //     response.json().then(data => {
  //       alert(`We are in business, ${data.email}`);
  //     });
  //   });
  // }

  render () {
  	return (
    <div>
      <p>      
      <button onClick={this.update}>update</button>
          <button onClick={this.getFiveTweetsEveryHalfMinute.bind(this)}>Fetch Tweets</button>      
      <StripeCheckout
        token={this.onToken}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY || config.STRIPE_PUBLISHABLE_KEY} 
      />
      </p>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));