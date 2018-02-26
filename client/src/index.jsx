import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
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
import Chart from './Chart.jsx'

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
      signupPassword: '',
      signupConfirmPassword: '',
      loginUsername: '',
      loginPassword: '',
      username: '',
      userProfile: null,
      userDonated: null,
      totalDonated: null,
      totalUsers: null,
      totalNumTweets: null
    }
    this.onToken = this.onToken.bind(this)
    setInterval(() => {
      this.getTrumpTweetsFromDb()
    }, 30000);
  }

  componentDidMount() {
    this.getTrumpTweetsFromDb() 
    this.getStats()
  }

  //this function asks the server to get trump's tweets from the db and send them here to display
  getTrumpTweetsFromDb() {
    axios.get('/getTrumpTweets/db')
    .then(res => {
      this.setState({
        tweets: res.data
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleOpen(name) {
    this.setState({
      [name]: true,
      openDialog: name
    });
  }

  handleCloseSignupCancel(name) {
    this.setState({
      [name]: false,
      openDialog: 'none'
    });
  }

  handleCloseSignupSubmit(name) {
    if (!this.state.signupUsername || !this.state.signupPassword || !this.state.signupEmail || !this.state.signupLimit || !this.state.signupConfirmPassword ) {
       return console.log('INFO MISSING YOU BITCH')
    } if (this.state.signupPassword !== this.state.signupConfirmPassword) {
      return console.log('PASSWORDS DONT MATCH DUMBASS')
    } if (isNaN(Number(this.state.signupLimit))) {
       return console.log('LIMIT NEEDS TO BE A NUMBER DOOSHBAG', this.state.signupLimit, Number(this.state.signupLimit))
    }
    else {
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
        if (res.data !== 'Username already exists!' || res.data !== 'error') {
          this.setState({
            loggedInUsername: res.data
          }, () => {
            console.log('this.state.loggedInUsername:', this.state.loggedInUsername);
          })
        }
      }).catch(err => {
        console.log('error:', err)
      })
    }
  }

  handleCloseCancel(){
    this.setState({
      openLogin: false,
      openDialog: 'none'
    });
  }

  handleCloseLogin() {
    // how to get username and password info to call submitLogin Func?
    this.setState({
      openLogin: false,
      openDialog: 'none'
    });
    console.log('this.state.loginUsername:', this.state.loginUsername);
    console.log('this.state.loginPassword:', this.state.loginPassword);
    this.submitLogin(this.state.loginUsername, this.state.loginPassword);
  }

  submitLogin(username, password) {
    // make a post req to server with username and password
    console.log(username, password)
    this.setState({
      loginUsername: '',
      loginPassword: ''
    })
    axios.post('/login', {
      username: username,
      password: password
    })
      .then(res => {
        console.log('loggin',res);
        if (res.status === 202) {
          this.setState({
            username: res.data
          }, () => {
            this.getUserProfile(this.state.username);
          })

        }
      })
      .catch(err => {
        console.log('error on submit login function', err);
      })
  }

  getUserProfile(username) {
    var context = this;
    axios.post('/userProfile', {
      username: username  
    })
      .then(res => {
        console.log('res.data from getting User Profile:', res.data);
        context.setState({
          userProfile: res.data
        }, () => {
          console.log('this.state.userProfile:', this.state.userProfile);
        })
      })
      .catch(err => {
        console.log('error getting user Profile:', err);
      })
  }

  getStats () { // retrieves stats from all users to show on main page- gets called in componenetDidMount
    var context = this;
    axios.get('/stats')
      .then(res => {
        console.log('res.data in getTotalDonated:', res.data);
        context.setState({
          totalDonated: Number(res.data.totalDonated),
          totalUsers: res.data.totalUsers,
          totalNumTweets: res.data.totalNumTweets
        }, () => {
          console.log('context.state.totalDonated:', context.state.totalDonated);
          console.log('context.state.totalUsers:', context.state.totalUsers);
          console.log('context.state.totalNumTweets:', context.state.totalNumTweets);
        });
      })
      .catch(err => {
        console.log('err getting totalDonated:', err);
      })
  }

  onToken(token) { // creates a new token when user clicks on pay with card, sends it to server
    const context = this;
    console.log('onToken', token)
    axios.post('/customerToken', {
      username: this.state.loggedInUsername,
      id: token.id,
      email: token.card.name
    }).then(res => {
      console.log(res)
      context.setState({
        openStripe: false
      })
    }).catch(err => {
      console.log(err)
    })
  }

  logout() {console.log('running')
    axios.post('/logout')
    .then(() => {
      this.setState({
        username: ''
      })
    })
    .catch(err => console.log('error on logout function:', err));
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
        alignItems: 'center',
        backgroundColor: '#ecf3f8'
      },
      paper: {
        flex: .3,
        backgroundColor: fullWhite,
        height: '75vh',
        overflow: 'scroll',
        backgroundColor: fullWhite,
      },
      image: {
        height: 90,

      },
      paperHeader: {
        flex: .75, 
        zIndex: 1,
        padding: 0,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        padding: 1,
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
        display: 'flex',
      },
    }
    const logIn = [
      <TextField
        floatingLabelText='Username'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
        onChange={(e) => {this.setState({loginUsername: e.target.value})}}
      />, <br />,
      <TextField
        floatingLabelText='Password'
        floatingLabelFixed={true}
        type='password'
        fullWidth={true}
        onChange={(e) => {this.setState({loginPassword: e.target.value})}}
      />,
      <FlatButton
        label='Cancel'
        primary={true}
        onClick = {
          this.handleCloseCancel.bind(this)
        }
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={false}
        onClick={(e) => {e.preventDefault(); this.handleCloseLogin()}}
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
      floatingLabelText='Confirm Password'
      floatingLabelFixed={true}
      type='password'
      fullWidth={true}
      onChange={(e) => {this.setState({signupConfirmPassword: e.target.value})}}
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
        onClick={this.handleCloseSignupCancel.bind(this, this.state.openDialog)}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={true}
        onClick={this.handleCloseSignupSubmit.bind(this, this.state.openDialog)}
      />,
    ];
    const stripe = [
      <StripeCheckout
        name="TrumpChange"
        description="Enter Your Card Info Below"
        panelLabel="Submit"
        allowRememberMe={false}
        //amount=''
        token={this.onToken}
        email={this.state.signupEmail}
        currency="USD"
        stripeKey="pk_test_t7nLVLP2iJEh2FegQRUPKt5p" 
      >
        <button
          className="submitbtn"
          //onClick={this.handleFormSubmit()}
          type="submit"
          value="Submit">EnterCreditCardInfo
        </button>
      </StripeCheckout>
    ];

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='App'style={style.app}>
          <div style={style.flex}>
            <Paper zDepth={2} style={style.paperHeader}>
              <div style={style.flexButton}>
                {this.state.username === '' ? 
                  <RaisedButton
                    style={{ margin: 7.925 }}
                    labelColor={white}
                    backgroundColor={red500}
                    label='Sign Up'
                    onClick={this.handleOpen.bind(this, "openSignUp")}
                  /> :
                  null
                }
                <Dialog
                  title='Enter a new username, password, and email'
                  actions={signUp}
                  modal={false}
                  open={this.state.openSignUp}
                  onRequestClose={this.handleCloseSignupCancel.bind(this, 'openSignUp')}
                />
                {this.state.username === '' ? 
                  <RaisedButton
                    style={{margin: 7.925}}
                    labelColor={white}
                    backgroundColor={red500}
                    label='Log In'
                    onClick={this.handleOpen.bind(this, "openLogin")}
                  /> :
                  <RaisedButton
                    style={{ margin: 7.925 }}
                    labelColor={white}
                    backgroundColor={red500}
                    label='Log Out'
                    onClick={this.logout.bind(this)}
                  />}
                <Dialog title='Enter your username and password'
                  actions={logIn}
                  modal={false}
                  open={this.state.openLogin}
                  onRequestClose = {
                    this.handleCloseCancel.bind(this)
                  }
                />
                <Dialog title='Enter Payment'
                  actions={stripe}
                  modal={false}
                  open={this.state.openStripe}/>
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
                zDepth={2}>
                <div className="tweets-app">
                  <TweetList tweets={this.state.tweets} />
                </div>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={2}>
                <Chart/>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={2}>
              </Paper>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));