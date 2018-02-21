import React from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
class Tweet extends React.Component {

  render() {
    const tweet = this.props.tweet;
    return (
      <li className='tweet'>
        <img src={tweet.avatar} className="avatar" />
        <blockquote>
          <cite>
            <a href={"http://www.twitter.com/" + tweet.username}>{tweet.name}</a>
            <span className="screen-name">@{tweet.username}</span>
          </cite>
          <span className="content">{tweet.tweet}</span>
        </blockquote>
      </li>
    )
  }
}
export default Tweet;
