import React from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { blue400, red500, redA100, blueA100 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';

class Tweet extends React.Component {

  render() {
    const style = {
      tweet: {
        fontSize: 11,
        margin: 5,
      },
      url: {
        color: blue400,
        fontSize: 11,
      },
      paper: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        display: 'flex',
      },
      list: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        padding: 0,
      },
      iconRetweet: {
        fontSize: 14,
        color: blueA100,
        margin: 2,
      },
      iconFavorites: {
        fontSize: 14,
        color: redA100,
        margin: 2,
      },
      iconCite: {
        fontSize: 11,
        margin: 2
      }
    }
    const tweet = this.props.tweet;
    return (
      <List style={style.list}>
        <Paper zDepth={2} >
        <ListItem
          disabled={true}
          leftAvatar={
            <Paper zDepth={2} style={style.paper}> 
              <Avatar style={style.avatar} src={tweet.avatar} 
              className='avatar'/>
            </Paper>
            }
          >
          <a style={style.url} href={"http://www.twitter.com/" + tweet.username}>{tweet.name}</a>
          <div>
            <cite style={style.tweet} className="screen-name">@{tweet.username}</cite>
          </div>
          <div style={style.tweet} className="content">{tweet.tweet}</div>
           <cite style={style.iconCite}> <i style={style.iconRetweet} className="material-icons">
            repeat 
            </i>
            {tweet.retweets}
            </cite>
            <cite style={style.iconCite}>
            <i style={style.iconFavorites} className="material-icons">
            favorite
            </i>
            {tweet.favorites}
            </cite>
        </ListItem>
        </Paper>
      </List>
    )
  }
}
export default Tweet;
