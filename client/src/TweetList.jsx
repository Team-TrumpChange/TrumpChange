import React from 'react';
import Tweet from './Tweet.jsx';

class TweetList extends React.Component {
  
  render() {
    const content = this.props.tweets.map(tweet => {
      return (
        <Tweet key={tweet._id} tweet={tweet} />
      )
    });
    return (
      <div className="tweet-list">{content}</div>
    )
  }
};

export default TweetList;