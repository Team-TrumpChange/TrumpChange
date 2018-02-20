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

    }
    this.onToken = this.onToken.bind(this)
  }

  getFiveTweetsEveryMinute() {
    const context = this;
    console.log('Pressed');
    setInterval(function() {
      context.getTweets();
    },6000)
  }

  getTweets() {
    axios.get('/fetchtweets', {
      params: {
        user: 'realdonaldtrump'
      }
    })
      .then((res) => {
        console.log('Success');
        console.log(res.data)
        res.data.forEach((element) => {
          console.log(element.text);
        })    
      })
      .catch((error) => {
        console.log('Error');
        console.log(error);
      })
  }

  componentDidMount() {
    console.log('processenv:',process.env, 'config:', config.STRIPE_PUBLISHABLE_KEY )
  }

  onToken(token) {
    console.log('onToken', token)
    axios.post('/customerToken', {
      token: token.id
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
      <button onClick={this.getFiveTweetsEveryMinute.bind(this)}>Fetch Tweets</button>      
      <StripeCheckout
        token={this.onToken}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY || config.STRIPE_PUBLISHABLE_KEY} 
      />
      </p>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));