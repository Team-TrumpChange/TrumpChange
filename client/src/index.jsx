import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import config from '../../config.js'
import StripeCheckout from 'react-stripe-checkout'
import dotenv from 'dotenv'
import axios from 'axios'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import spacing from 'material-ui/styles/spacing';
import { fade } from 'material-ui/utils/colorManipulator';
import { red500, blue400, grey600, grey300, blueA100, blueA200, blueA400, fullWhite, fullBlack, darkBlack, white } from 'material-ui/styles/colors';
import Tweet from './Tweet.jsx';
import TweetList from './TweetList.jsx';
import Subheader from 'material-ui/Subheader';
import List from 'material-ui/List/List';

dotenv.config();

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      tweets: [],
      openLogin: false,
      openSignUp: false,
      openStripe: false,
      openDialog: 'none',
      signupUsername: '',
      signupPassword: '',
      signupEmail: '',
      signupLimit: ''
    }
    this.onToken = this.onToken.bind(this)
    this.update = this.update.bind(this)
    this.getTrumpTweetsFromDb = this.getTrumpTweetsFromDb.bind(this)
  }


  componentDidMount() {
    this.getTrumpTweetsFromDb() 
  }

  //this function asks the server to get trump's tweets from the db and send them here to display
  getTrumpTweetsFromDb() {
    setInterval(() => {
      axios.get('/getTrumpTweets/db')
      .then(res => {
        console.log(res.data)
        this.setState({
          tweets: res.data
        })
      }).catch(err => {
        console.log(err)
      })
    }, 6000)
  }

  handleOpen(name) {
    this.setState({
      [name]: true,
      openDialog: name
    });
  };

  handleClose(name) {
    this.setState({ 
      [name]: false,
      openDialog: name,
      openDialog: 'none',
      openStripe: true,
    });
    axios.post('/createAccount', {
      username: this.state.signupUsername,
      password: this.state.signupPassword,
      email: this.state.signupEmail,
      maxWeeklyPlans: this.state.signupLimit
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log('error:', err)
    })
  };

  // getTweets() { // gets new tweets from server (server does api call to twitter)
  //   const context = this;
  //   axios.get('/fetchtweets', {
  //     params: {
  //       user: 'realdonaldtrump'
  //     }
  //   })
  //     .then((res) => {
  //       console.log('Success');
  //       console.log(res.data)

  //       if (context.checkForNewTweets(data)) { // checks if the last tweet is new and resets the state
  //         context.setState({
  //           tweets: res.data
  //         });
  //       }
  //       res.data.forEach((element) => {
  //         console.log(element.text);
  //       })    
  //     })
  //     .catch((error) => {
  //       console.log('Error:', error);
  //     })
  // }

  // componentDidMount() {
  //   // console.log('processenv:',process.env, 'config:', config.STRIPE_PUBLISHABLE_KEY )
  // }

  onToken(token) { // creates a new token when user clicks on pay with card, sends it to server
    console.log('onToken', token)
    axios.post('/customerToken', {
      id: token.id,
      email: token.card.name
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  update() {
    axios.post('/update', {
      quantity: 10
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  submitLogin(username, password) {
    // make a post req to server with username and password
    axios.post('/login', {
      username: username,
      password: password
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
  


  render () {
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: blue400,
        primary2Color: red500,
        primary3Color: grey600,
        accent1Color: blue400,
        accent2Color: blue400,
        accent3Color: blue400,
        textColor: fullBlack,
        secondaryTextColor: fade(darkBlack, 0.54),
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: red500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
      },
    })
    const style = {
      flex: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      },
      mainBody: {
        flexGrow: 1,
        display: 'flex',
        backgroundColor: fullWhite,
        justifyContent: 'space-around',
        alignItems: 'center'
      },
      paper: {
        flex: .3,
        backgroundColor: fullWhite,
        height: '75vh',
        overflow: 'scroll',
      },
      image: {
        height: 100,
      },
      paperHeader: {
        flex: .75, 
        zIndex: 1,
        padding: 0,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
      },
      flexButton: {
        flex: 1,
        flexDirection: 'row-reverse',
        display:'flex',
        justifyContent: 'flex-start',
        paddingRight: 15.85,
      },
      flexImage: {
        flex: 1,
        display: 'flex'
      }
    }
    const logIn = [
      <TextField
        floatingLabelText='Username'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
      />, <br />,
      <TextField
        floatingLabelText='Password'
        floatingLabelFixed={true}
        type='password'
        fullWidth={true}
      />,
      <FlatButton
        label='Cancel'
        primary={true}
        onClick={this.handleClose.bind(this, this.state.openDialog)}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose.bind(this, this.state.openDialog)}
      />,
    ];
    const signUp = [
      <TextField
        floatingLabelText='New Username'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
        onChange={(e) => {this.setState({signupUsername: e.target.value})}}
      />, <br />,
      <TextField
        floatingLabelText='New Password'
        floatingLabelFixed={true}
        type='password'
        fullWidth={true}
        onChange={(e) => {this.setState({signupPassword: e.target.value})}}
      />,
      <TextField
        floatingLabelText='Email'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
        onChange={(e) => {this.setState({signupEmail: e.target.value})}}
      />,
      <TextField
        floatingLabelText='Limit'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
        onChange={(e) => {this.setState({signupLimit: e.target.value})}}
      />,
      <FlatButton
        label='Cancel'
        primary={true}
        onClick={this.handleClose.bind(this, this.state.openDialog)}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={true}
        onClick={
          this.handleClose.bind(this, this.state.openDialog)
        }
      />,
    ];
    const stripe = [
      <StripeCheckout
        token={this.onToken}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY || config.STRIPE_PUBLISHABLE_KEY} 
        onClick={
          this.handleClose.bind(this, this.state.openStripe)
        }
      />
    ];
  	return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className ='App'>
          <div style={style.flex}>
            <Paper zDepth={3} style={style.paperHeader}>
              <div style={style.flexButton}>
                <RaisedButton
                  style={{ margin: 7.925 }}
                  labelColor={white}
                  backgroundColor={red500}
                  label='Sign Up'
                  onClick={this.handleOpen.bind(this, "openSignUp")}
                />
                <Dialog
                  title='Enter a new username, password, and email'
                  actions={signUp}
                  modal={false}
                  open={this.state.openSignUp}
                  onRequestClose={this.handleClose.bind(this, 'openSignUp')}
                />
                <RaisedButton
                  style={{margin: 7.925}}
                  labelColor={white}
                  backgroundColor={red500}
                  label='Log In'
                  onClick={this.handleOpen.bind(this, "openLogin")}
                />
                <Dialog title='Enter your username and password'
                  actions={logIn}
                  modal={false}
                  open={this.state.openLogin}
                  onRequestClose={this.handleClose.bind(this, 'openLogin')}
                />
                <Dialog title='Enter Payment'
                  actions={stripe}
                  modal={false}
                  open={this.state.openStripe}
                  onRequestClose={this.handleClose.bind(this, 'openStripe')}
                />
              </div>
              <div style={style.flexImage}>
                <img
                  style={style.image}
                  src='https://i.imgur.com/Kp92VKH.png'
                />
              </div>
            </Paper>
            <div style={style.mainBody}>
              <Paper 
                style={style.paper}
                zDepth={3}>
                <div className="tweets-app">
                  <TweetList tweets={this.state.tweets} />
                </div>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={3}>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={3}>
              </Paper>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    // <div>
    //   <p>      
    // 
    //   <StripeCheckout
    //     token={this.onToken}
    //     stripeKey={process.env.STRIPE_PUBLISHABLE_KEY || config.STRIPE_PUBLISHABLE_KEY} 
    //   />
    //   </p>
    // </div>
  
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));