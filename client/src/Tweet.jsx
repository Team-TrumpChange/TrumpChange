import React from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { blue400, red500, redA100 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';

class Tweet extends React.Component {

  render() {
    const style = {
      tweet: {
        fontSize: 12,
      },
      url: {
        color: blue400,
        fontSize: 12,
      },
      avatar: {
        boxShadow: 'rgba(0, 0, 0, 0.16) 2px 2px 8px',
      },
      list: {
        paddingTop: 15,
        paddingBottom: 0,
        paddingRight: 15,
        paddingLeft: 15,
      }
    }
    const tweet = this.props.tweet;
    return (
      <List style={style.list}>
        <Paper style={{ padding: 0}} zDepth={2}>
        <ListItem
          disabled={true}
          leftAvatar={
            <Avatar style={style.avatar} src={tweet.avatar} 
            className='avatar'
            />}
          >
          <a style={style.url} href={"http://www.twitter.com/" + tweet.username}>{tweet.name}</a>
          <div>
            <cite style={style.tweet} className="screen-name">@{tweet.username}</cite>
          </div>
          <br/>
          <div style={style.tweet} className="content">{tweet.tweet}</div>
        </ListItem>
        </Paper>
      </List>
    )
  }
}
export default Tweet;
