import React from 'react';
import ReactDOM from 'react-dom';

class About extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    const style = {
      paperLarge: {
        borderRadius: '0%',
        height: '362px',
        width: '410px',
        // display: 'flex',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10
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
      }
    }

    return (
      <div>
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
          <div style={style.heading}>
            Charity Info Here
          </div>
        </Paper>
      </div>
    )
  }
}

export default About;