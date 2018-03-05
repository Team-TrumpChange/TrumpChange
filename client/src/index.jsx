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
import { lightBlue500, red500, blue400, grey600, grey300, blueA100, blueA200, blueA400, fullWhite, fullBlack, darkBlack, white } from 'material-ui/styles/colors';
import Tweet from './Tweet.jsx';
import TweetList from './TweetList.jsx';
import Subheader from 'material-ui/Subheader';
import List from 'material-ui/List/List';
import CircularProgress from 'material-ui/CircularProgress';
import Chart from './Chart.jsx'
import UserProfile from './UserProfile.jsx'
import About from './About.jsx';
import { Alert } from 'antd';

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      tweets: [],
      openLogin: false,
      openSignUp: false,
      openStripe: false,
      openFAQ: false,
      openDialog: 'none',
      openUpdate: false,
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
      totalNumTweets: 0,
      blankUsernameLoginError: false,
      blankUsernamePasswordError: false,
      userNotExistsError: false,
      badPasswordError: false,
      blankUsernameError: false,
      blankPasswordError: false,
      blankConfirmPasswordError: false,      
      passwordMatchError: false,
      blankEmailError: false,
      blankLimitError: false,
      numberLimitError: false,
      hundredLimitError: false,
      wholeNumberLimitError: false,
      usernameExistsError: false,
      emailExistsError: false,
      accountCreationSuccess: false
    }
    this.onToken = this.onToken.bind(this)
    setInterval(() => {
      this.getTrumpTweetsFromDb()
    }, 30000);
    this.getUserProfile= this.getUserProfile.bind(this)
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

  handleClose(name, callback) {
    this.setState({
      [name]: false,
      openDialog: 'none',
    });
    if (callback) {
      callback();
    }
  }

  clearUserInput() {
    this.setState({
      loginUsername: '',
      loginPassword: '',
      signupUsername: '',
      signupPassword: '',
      signupConfirmPassword: '',
      signupEmail: '',
      signupLimit: '',
      blankUsernameLoginError: false,
      blankUsernamePasswordError: false,
      userNotExistsError: false,
      badPasswordError: false,
      blankUsernameError: false,
      blankPasswordError: false,
      blankConfirmPasswordError: false,
      passwordMatchError: false,
      blankEmailError: false,
      blankLimitError: false,
      numberLimitError: false,
      hundredLimitError: false,
      wholeNumberLimitError: false,
      usernameExistsError: false,
      emailExistsError: false
    })
  }

  clearUpdateInput() {
    this.setState({
      updatedUsername: '',
      updatedWeeklyLimit: '',
    })
  }

  handleErrorState(error) {
    this.setState({
      [error]: true
    })
  }

  submitSignUp(username, password, passwordConfirm, email, limit) {
    if (username === '') {
      this.setState({
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        blankLimitError: false,
        numberLimitError: false,
        hundredLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false,
      })
      this.handleErrorState('blankUsernameError');
    } else if (password === '') {
      this.setState({
        blankUsernameError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        blankLimitError: false,
        numberLimitError: false,
        hundredLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('blankPasswordError');
    } else if (passwordConfirm === '') {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        blankLimitError: false,
        numberLimitError: false,
        hundredLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('blankConfirmPasswordError');      
    } else if (password !== passwordConfirm) {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        blankEmailError: false,
        blankLimitError: false,
        numberLimitError: false,
        hundredLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('passwordMatchError');      
    } else if (email === '') {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankLimitError: false,
        numberLimitError: false,
        hundredLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('blankEmailError');      
    } else if (limit === '') {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        numberLimitError: false,
        hundredLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('blankLimitError');      
    } else if (isNaN(Number(limit))) {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        blankLimitError: false,
        hundredLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('numberLimitError');      
    } else if (Number(limit) > 99) {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        blankLimitError: false,
        numberLimitError: false,
        wholeNumberLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('hundredLimitError');      
    } else if (Number(limit) % 1 !== 0) {
      this.setState({
        blankUsernameError: false,
        blankPasswordError: false,
        blankConfirmPasswordError: false,
        passwordMatchError: false,
        blankEmailError: false,
        blankLimitError: false,
        numberLimitError: false,
        hundredLimitError: false,
        usernameExistsError: false,
        emailExistsError: false
      })
      this.handleErrorState('wholeNumberLimitError');      
    } else {
      axios.post('/createAccount', {
        username: this.state.signupUsername,
        password: this.state.signupPassword,
        email: this.state.signupEmail,
        maxWeeklyPlans: this.state.signupLimit
      }).then(res => {
        console.log('res.data from /createAccount post:', res.data);
        if (res.data === 'Username already exists') {
          this.setState({
            blankUsernameError: false,
            blankPasswordError: false,
            blankConfirmPasswordError: false,
            passwordMatchError: false,
            blankEmailError: false,
            blankLimitError: false,
            numberLimitError: false,
            hundredLimitError: false,
            wholeNumberLimitError: false,
            emailExistsError: false
          })
          this.handleErrorState('usernameExistsError')
        } else if (res.data === 'Email already exists') {
          this.setState({
            blankUsernameError: false,
            blankPasswordError: false,
            blankConfirmPasswordError: false,
            passwordMatchError: false,
            blankEmailError: false,
            blankLimitError: false,
            numberLimitError: false,
            hundredLimitError: false,
            wholeNumberLimitError: false,
            usernameExistsError: false,
          })
          this.handleErrorState('emailExistsError')
        } else if ('User saved in saveUserIntoDataBase') {
          this.handleErrorState('accountCreationSuccess')
          this.handleClose('openSignUp', () => {
            this.setState({
              username: res.data,
              openStripe: true,
            }, () => {
              console.log('this.state.username:', this.state.username);
              this.getUserProfile(this.state.username);
            });
          });
        }
      }).catch(err => {
        console.log('error:', err)
      })
    }
  }

  submitLogin(username, password) {
    // make a post req to server with username and password
    if (username === '') {
      this.setState({
        blankUsernamePasswordError: false,
        userNotExistsError: false,
        badPasswordError: false,
      });
      this.handleErrorState('blankUsernameLoginError');
    } else if (password === '') {
      this.setState({
        blankUsernameLoginError: false,
        userNotExistsError: false,
        badPasswordError: false,
      });
      this.handleErrorState('blankUsernamePasswordError');
    } else {
      axios.post('/login', {
        username: username,
        password: password
      })
        .then(res => {
          if (res.status === 202) {
            this.setState({
              username: res.data,
              loggedInUsername: res.data
            })
            this.handleClose('openLogin');
            this.clearUserInput();
            this.getUserProfile(this.state.username);
          } if (res.status === 200) {
              if (res.data === 'user not found') {
                this.setState({
                  blankUsernameLoginError: false,
                  blankUsernamePasswordError: false,
                  badPasswordError: false,
                });
                this.handleErrorState('userNotExistsError');
              } else if (res.data === 'password does not match') {
                this.setState({
                  blankUsernameLoginError: false,
                  blankUsernamePasswordError: false,
                  userNotExistsError: false,
                });
                this.handleErrorState('badPasswordError');
              }
          }
        })
        .catch(err => {
          console.log(err)
        });
    }
  }

  changeUserInfo(username, limit) {
    if (username === '' && limit === '') {
      console.log('Please enter a username or limit');
    } else if (limit === '' && isNaN(Number(limit)) && Number(limit) > 100) {
      console.log('Please enter a number under 100');
    } else {
      axios.post('/changeWeeklyLimit', {
        currentName: this.state.userProfile.username,
        maxWeeklyPlans: limit
      })
        .then(res => {
          if (res.data === 'updated maxWeeklyPlans') {
            let userProfile = Object.assign({}, this.state.userProfile);
            userProfile.maxWeeklyPlans = limit;
            this.setState({
              userProfile: userProfile
            });
          }
          return axios.post('/changeUsername', {
            currentName: this.state.userProfile.username,
            newName: username,
          })
        })
        .then(res => {
          if (res.data === 'updated username') {
            let userProfile = Object.assign({}, this.state.userProfile);
            userProfile.username = username;
            this.setState({
              username: username,
              userProfile: userProfile
            });
          }
          if (res.data === 'no changes requested' || res.data === 'updated username') {
            this.clearUpdateInput();
            this.handleClose('openUpdate');
          } else {
            console.log('something went wrong');
          }
        })
        .catch(err => {
          console.log('error changing user info:', err);
        })
    }
  }

  getUserProfile(username) {
    axios.post('/userProfile', {
      username: username  
    })
      .then(res => {
        console.log('res.data from getting User Profile:', res.data);
        this.setState({
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
    console.log(this.state.loggedInUsername)
    this.setState({
      openStripe: false
    }, (err) => {
      if (!err) {
        axios.post('/customerToken', {
          username: this.state.username,
          id: token.id,
          email: token.email,
          cardID: token.card.id
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    });
  }

  logout() {console.log('running')
    axios.post('/logout')
    .then(() => {
      this.setState({
        username: '',
        userProfile: null,
        userDonated: null,
        loggedInUsername: ''
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
      logo: {
        height: 22,
        width:22
      },
      faqlogo: {
        height: 20,
        width:20
      },
      // flexLogo: {
      //   float: 'right'
      // },
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
      this.state.blankUsernameLoginError ?
        <Alert
          description="Please enter a username"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankUsernamePasswordError ?
        <Alert
          description="Please enter a password"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.userNotExistsError ?
        <Alert
          description="This user does not exists"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.badPasswordError ?
        <Alert
          description="This password is incorrect"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
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
      this.state.blankUsernameError ? 
        <Alert
          description="Please enter a username"
          type="error"
          showIcon
          style={{textAlign: 'left'}}
        /> :
        null,
      this.state.blankPasswordError ?
        <Alert
          description="Please enter a password"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankConfirmPasswordError ?
        <Alert
          description="Please confirm your password"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.passwordMatchError ?
        <Alert
          description="Passwords do not match"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankEmailError ?
        <Alert
          description="Please enter an email"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.blankLimitError ?
        <Alert
          description="Please enter a weekly limit"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.numberLimitError ?
        <Alert
          description="Please be sure your limit is a number"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.hundredLimitError ?
        <Alert
          description="Please be sure your limit is less than 100"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.wholeNumberLimitError ?
        <Alert
          description="Please be sure your limit is a whole number"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.usernameExistsError ?
        <Alert
          description="This username already exists"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.emailExistsError ?
        <Alert
          description="This email address already exists"
          type="error"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
      this.state.accountCreationSuccess ?
        <Alert
          description="Success creating account"
          type="success"
          showIcon
          style={{ textAlign: 'left' }}
        /> :
        null,
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
    const update = [
      <TextField
        floatingLabelText='Username'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
        onChange={(e) => { this.setState({ updatedUsername: e.target.value }) }}
      />, <br />,
      <TextField
        floatingLabelText='Weekly Limit'
        floatingLabelFixed={true}
        type='text'
        fullWidth={true}
        onChange={(e) => { this.setState({ updatedWeeklyLimit: e.target.value }) }}
      />,
      <FlatButton
        label='Cancel'
        primary={true}
        onClick={(e) => {
          this.handleClose('openUpdate'), this.clearUserInput();
        }}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={false}
        onClick={(e) => { e.preventDefault(); this.changeUserInfo(this.state.updatedUsername, this.state.updatedWeeklyLimit) }}
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

    const faq = [
      <FlatButton
        label='close'
        primary={true}
        onClick={() => {this.setState({openFAQ:false})}}
      />
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
                    backgroundColor={lightBlue500}
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
                    backgroundColor={lightBlue500}
                    label='Log In'
                    onClick={this.handleOpen.bind(this, "openLogin")}
                  /> :
                  <RaisedButton
                    style={{ margin: 7.925 }}
                    labelColor={white}
                    backgroundColor={blue400}
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
                  onRequestClose = {() => {this.setState({openStripe: false})}}
                />
                <Dialog title='FAQ'
                actions={faq}
                modal={false}
                open={this.state.openFAQ}
                onRequestClose = {
                  () => {this.setState({openFAQ:false})}
                }
                />
              </div>
              <div style={style.flexImage}>
                <img
                  style={style.image}
                  src='https://i.imgur.com/Kp92VKH.png'
                />
                 <div onClick={() => {this.setState({openFAQ:true})}}>
                 <img
                  style={style.faqlogo}
                  src= 'https://cdn2.iconfinder.com/data/icons/basic-ict-line-icons/100/17-512.png'
                /> 
                </div>
                <a href="https://twitter.com/thetrumpchange" target="_blank">
              <img
                  style={style.logo}
                  src= 'http://pngimg.com/uploads/twitter/twitter_PNG29.png'
                />
                </a>
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

                {this.state.totalDonated ? 
                <Chart totalNumTweets={this.state.totalNumTweets} totalDonated={this.state.totalDonated} totalUsers={this.state.totalUsers}/>
              : <div></div>}

              </Paper>
              <Paper
                style={style.paper}
                zDepth={2}>
                {
                  this.state.username === '' 
                    ? 
                      <About />
                    :
                      this.state.userProfile === null 
                        ? 
                          <div>
                            <CircularProgress size={80} thickness={5} color={blue400}/>
                          </div> 
                        :
                          <UserProfile 
                            getUserProfile={this.getUserProfile}
                            userProfile={this.state.userProfile} 
                            onToken={this.onToken}
                            changeUserInfo={this.changeUserInfo.bind(this)}
                            handleOpen={this.handleOpen.bind(this)}
                          />
                }
                <Dialog
                  title='Update username and/or max weekly donations'
                  actions={update}
                  modal={false}
                  open={this.state.openUpdate}
                  onRequestClose={(e) => { this.handleClose('openUpdate'); this.clearUserInput() }}
                />
              </Paper>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));