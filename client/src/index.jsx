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
      signupLimit: '',
      singupUsername: '',
      signupPassword: ''
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
  }


  handleCloseSignup(name) {
    this.setState({
      [name]: false,
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
  }

  handleCloseLogin(name) {
    // how to get username and password info to call submitLogin Func?
    this.setState({
      [name]: false,
      openDialog: 'none'
    });

    this.submitLogin(this.state.signupUsername, this.state.signupPassword);
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
      // call render stripe token
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  render () {
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: red500,
        primary2Color: blue400,
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
      flexHeader: {
        height: '10vh',
        display: 'flex',
        flexDirection: 'row-reverse',

        backgroundColor: fullWhite,
        alignItems: 'center',
        boxShadow: '0 19px 20px  rgba(0, 0, 0, .1)',
        zIndex: 1,
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
        height: '70vh',
        alignItems: 'center',
        overflow: 'scroll',
      },
      image: {
        flex: .2,
      },
      buttons: {
        margin: 15,
      },
    }
    const logIn = [
      <TextField
        floatingLabelText='Username'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
        onChnage={(e) => {this.setState({loginPassword: e.target.value})}}
      />, <br />,
      <TextField
        floatingLabelText='Password'
        floatingLabelFixed={true}
        type='password'
        fullWidth={true}
        onChange={(e) => {this.setState({loginUsername: e.target.value})}}
      />,
      <FlatButton
        label='Cancel'
        primary={true}
        onClick={this.handleCloseLogin.bind(this, this.state.openDialog)}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={true}
        onClick={this.handleCloseLogin.bind(this, this.state.openDialog)}
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
        onClick={this.handleCloseSignup.bind(this, this.state.openDialog)}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={true}
        onClick={this.handleCloseSignup.bind(this, this.state.openDialog)}
      />,
    ];
    const stripe = [
      <StripeCheckout
        token={this.onToken}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY || config.STRIPE_PUBLISHABLE_KEY} 
      />
    ];
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='App'>
          <div style={style.flex}>
            <div style={style.flexHeader}>
              <RaisedButton
                style={style.buttons}
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
                onRequestClose={this.handleCloseSignup.bind(this, 'openSignUp')}
              />
              <RaisedButton
                style={style.buttons}
                labelColor={white}
                backgroundColor={red500}
                label='Log In'
                onClick={this.handleOpen.bind(this, "openLogin")}
              />
              <Dialog title='Enter your username and password'
                actions={logIn}
                modal={false}
                open={this.state.openLogin}
                onRequestClose={this.handleCloseLogin.bind(this, 'openLogin')}
              />
              <Dialog title='Enter Payment'
                actions={stripe}
                modal={false}
                open={this.state.openStripe}
              />
              <img style={style.image} src='' alt='' />
              <img style={style.image} src='' alt='' />
              <img style={style.image} src='' alt='' />
              <img style={style.image} src='' alt='' />
              <img
                style={style.image}
                src='https://i.imgur.com/Kp92VKH.png'
                height='80vh'
                width='80vh'
              />
            </div>
            <div style={style.mainBody}>
              <Paper
                style={style.paper}
                zDepth={5}>
                <div className="tweets-app">
                  <TweetList tweets={this.state.tweets} />
                </div>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={5}>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={5}>
              </Paper>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));