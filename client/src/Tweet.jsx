import React from 'react';

class Tweet extends Component {
  render() {
    const tweet = this.props.tweet;
    return (
      <li className='tweet'>
        <img src={tweet.avatar} className="avatar" />
        <blockquote>
          <cite>
            <a href={"http://www.twitter.com/" + tweet.username}>{tweet.author}</a>
            <span className="screen-name">@{tweet.username}</span>
          </cite>
          <span className="content">{tweet.tweet}</span>
        </blockquote>
      </li>
    )
  }
}
export default Tweet;
