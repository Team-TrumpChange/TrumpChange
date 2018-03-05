import React from 'react';
import ReactDOM from 'react-dom';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


class About extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    const style = {
      paperLarge: {
        // display: 'grid',
        borderRadius: '0%',
        // height: '358px',
        // width: '555px',
        // display: 'flex',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      },
      heading: {
        fontSize: 24,
        fontWeight: 50,
        marginTop: 60,
        marginBottom: 20,
        textAlign: 'center'
      },
      subheading: {
        marginBottom: 30,
        fontSize: 18,
        textAlign: 'center',
        fontStyle: 'italic'
      },
      info: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10
      },
      infoHeading: {
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center'
      }, 
      flex: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      },
      card: {
        // height: 
      }
    }

    return (
      <div >
        <Paper zDepth={2} style={style.paperLarge}>
          <div style={style.heading}> 
              Contribute to Change
          </div>
          <div style={style.subheading}>
            donate a dollar to charity every time Trump tweets
          </div>
          <div style={style.infoHeading}>
            How it works:
          </div>
          <div style={style.info}>
            Option to set a weekly max donation limit  
          </div>
          <div style={style.info}> 
            Subscriptions are billed weekly
          </div>
        </Paper>
        <Paper zDepth={2} style={style.paperLarge}>
          <Card>
            <CardMedia
              // overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRpSd8BdYBZLenru101fTlwa1jW-i38QLzlH1SwcOnlkRWRVuP" alt="" />
            </CardMedia>
            <CardTitle title="Our current charity" />
          </Card>
        </Paper>
      </div>
    )
  }
}

export default About;