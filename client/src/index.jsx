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
import Chart from './Chart.jsx';
import About from './About.jsx';
import UserProfile from './UserProfile.jsx';

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
      signupConfirmPassword: '',
      signupEmail: '',
      signupLimit: '',
      loginUsername: '',
      loginPassword: '',
      username: '',
      userProfile: null,
      userDonated: null,
      totalDonated: 0,
      totalUsers: 0,
      totalNumTweets: 0
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

  handleClose(name) {
    this.setState({
      [name]: false,
      openDialog: 'none',
    });
  }

  clearUserInput() {
    this.setState({
      loginUsername: '',
      loginPassword: '',
      signupUsername: '',
      signupPassword: '',
      signupConfirmPassword: '',
      signupEmail: '',
      signupLimit: ''
    })
  }

  submitSignUp(username, password, passwordConfirm, email, limit) {
    if (username === '') {
      console.log('Please fill in username');
    } else if (password === '') {
      console.log('Please fill in password');
    } else if (passwordConfirm === '') {
      console.log('Please confirm password');
    } else if (password !== passwordConfirm) {
      console.log('Passwords do not match');
    } else if (email === '') {
      console.log('Please fill in email');
    } else if (limit === '') {
      console.log('Please enter a limit')
    } else if (isNaN(Number(limit))) {
      console.log('Please enter in only a number');
    } else if (Number(limit) > 99) {
      console.log('Please enter a number less 100')
    } else if (Number(limit) % 1 !== 0) {
      console.log('Please enter in a whole number');
    } else {
      axios.post('/createAccount', {
        username: this.state.signupUsername,
        password: this.state.signupPassword,
        email: this.state.signupEmail,
        maxWeeklyPlans: this.state.signupLimit
      }).then(res => {
        console.log(res)
        if (res.data === 'Username already exists') {
          console.log('Username already exists');
        } else if (res.data === 'Email already exists') {
          console.log('A user with this email already exists')
        } else if ('User saved in saveUserIntoDataBase') {
          this.handleClose('openSignUp');
          this.setState({
            username: res.data,
            openStripe: true,
          })
        }
      }).catch(err => {
        console.log('error:', err)
      })
    }
  }

  submitLogin(username, password) {
    // make a post req to server with username and password
    console.log(username, password)
    axios.post('/login', {
      username: username,
      password: password
    })
      .then(res => {
        console.log('loggin',res);
        if (res.status === 202) {
          this.setState({
            username: res.data,
          })
          this.handleClose('openLogin');
          this.clearUserInput();
          this.getUserProfile(this.state.username);
        } if (res.status === 200) {
            if (res.data === 'user not found') {
              console.log('user does not exist');
              //this.userNotFound();
            } else if (res.data === 'password does not match') {
              console.log('password does not match');
              //this.passwordNotMatched();
            }
        }
      })
      .catch(err => {
        console.log(err)
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
    axios.get('/stats')
      .then(res => {
        this.setState({
          totalDonated: Number(res.data.totalDonated),
          totalUsers: Number(parseInt(res.data.totalUsers)),
          totalNumTweets: Number(parseInt(res.data.totalNumTweets))
        }, () => {
     
        });
      })
      .catch(err => {
        console.log('err getting totalDonated:', err);
      })
  }

  onToken(token) { // creates a new token when user clicks on pay with card, sends it to server
    console.log('onToken', token)
    axios.post('/customerToken', {
      username: this.state.username,
      id: token.id,
      email: token.email
    }).then(res => {
      console.log(res)
      this.setState({
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
        username: '',
        userProfile: null,
        userDonated: null,
        hasSubscriberId: null
      })
    })
    .catch(err => console.log('error on logout function:', err));
  }

  cancelSubscription() {
    axios.post('/cancelSubscription', {
      username: this.state.username
    })
      .then(data => {
        console.log('data from cancelSubscription:', data);
      })
      .catch(err => {
        console.log('error cancelling subsciption:', err);
      });
  }

  changeUserInfo() {
    axios.post('/changeUserInfo', {
      username: 'glova25',
      newName: 'glov3',
      maxWeeklyPlans: 4
    })
      .then(data => {
        console.log('data from changeUserInfo:', data);
      })
      .catch(err => {
        console.log('error changing user info:', err);
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
      paperChart: {
        borderRadius: 0,
        margin: 10,
        height: '96%',
        width: '94.5%',
        overflow: 'hidden',
        diplay: 'flex'
      }
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
        onClick = {(e) => {
          this.handleClose('openLogin'), this.clearUserInput();
        }}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={false}
        onClick={(e) => { e.preventDefault(); this.submitLogin(this.state.loginUsername, this.state.loginPassword)}}
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
        onClick={(e) => {this.handleClose('openSignUp'); this.clearUserInput()}}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={true}
        onClick={(e) => {e.preventDefault(); this.submitSignUp(this.state.signupUsername, this.state.signupPassword, this.state.signupConfirmPassword, this.state.signupEmail, this.state.signupLimit)}}
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
        closed={this.clearUserInput.bind(this)}
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
                  onRequestClose={(e) => { this.handleClose('openSignUp'); this.clearUserInput()}}
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
                    (e) => {
                      this.handleClose('openLogin'); this.clearUserInput()
                  }}
                />
                <Dialog title='Enter Payment'
                  actions={stripe}
                  modal={false}
                  open={this.state.openStripe}
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
                zDepth={2}>
                <div className="tweets-app">
                  <TweetList tweets={this.state.tweets} />
                </div>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={2}>
                <Paper zDepth={2} style={style.paperChart}>
                <Chart 
                totalDonated={this.state.totalDonated}
                totalUsers={this.state.totalUsers}
                totalNumTweets={this.state.totalNumTweets}
                />
                </Paper>
              </Paper>
              <Paper
                style={style.paper}
                zDepth={2}>
                {this.state.username === '' ? <About /> : <UserProfile userProfile={this.state.userProfile}/>}
              </Paper>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));