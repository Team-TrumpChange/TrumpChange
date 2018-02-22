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
      paper: {
        borderRadius: '50%',
        height: '40px',
        width: '40px'
      },
      list: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingRight: 14,
        paddingLeft: 14,
      },
    }
    const tweet = this.props.tweet;
    return (
      <List style={style.list}>
        <Paper zDepth={3} >
        <ListItem
          disabled={true}
          leftAvatar={
            <Paper zDepth={3} style={style.paper}> 
              <Avatar style={style.avatar} src={tweet.avatar} 
              className='avatar'/>
            </Paper>
            }
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
