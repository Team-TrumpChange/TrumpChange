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
        flexGrow: 1,
        height: '35vh'
      },
      heading: {
        textAlign: 'center',
        height: '5vh',
        // flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      subheading: {
        marginTop: 26,
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
        height: '5vh',
        flexGrow: 1,
        display: 'grid'
      },
      donate: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      },
      info: {
        fontSize: 14,
        textAlign: 'center',
        height: '5vh',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      },
      infoHeading: {
        marginBottom: 10,
        fontSize: 16,
        textAlign: 'center',
        height: '5vh',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }, 
      card: {
        // height: 
      }
    }

    return (
      <div >
        <Paper zDepth={2} style={style.paperLarge}>
          <div style={style.heading}> 
            <img src="https://tbncdn.freelogodesign.org/87a2da9f-f329-4945-83b1-d64d01005948.png?1520271610438"/>
          </div>
          <div style={style.subheading}></div>
          <div style={style.info}>
            <div style={style.donate}>donate a dollar to charity every time Trump tweets</div>
            How it works: <br></br>
            Option to set a weekly max donation limit  <br></br>
            Subscriptions are billed weekly <br></br>
            Email us at: trumpchange2 at gmail.com
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