import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {

  	}
  }

  getFiveTweetsEveryMinute() {
    const context = this;
    console.log('Pressed');
    setInterval(function() {
      context.getTweets();
    },60000)
  }

  getTweets() {
    axios.get('/fetchtweets', {
      params: {
        user: 'realdonaldtrump'
      }
    })
      .then((res) => {
        console.log('Success');
        res.data.forEach((element) => {
          console.log(element.text);
        })    
      })
      .catch((error) => {
        console.log('Error');
        console.log(error);
      })
  }

  render () {
  	return (
      <div>
        <button onClick={this.getFiveTweetsEveryMinute.bind(this)}>Fetch Tweets</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));