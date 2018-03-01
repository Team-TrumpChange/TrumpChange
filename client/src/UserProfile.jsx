import React from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { red500, blue400, grey600, grey300, blueA100, blueA200, blueA400, fullWhite, fullBlack, darkBlack, white } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import $ from 'jquery';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      updatedUsername: '',
      updatedWeeklyLimit: '',
      openUpdate: false,
      openCancel: false,
      openCancelConfirmation: false,
      openUnconfirmed: false
    }
    this.onTokenUpdateCard= this.onTokenUpdateCard.bind(this)
  }

  onTokenUpdateCard(token) {
      console.log('updating', token)
      console.log(token.card.id)
      axios.post('/updateCustomer', {
          customerId : this.props.userProfile.customerID,
          card : this.props.userProfile.cardID,
          token : token.id,
          newCard : token.card.id
      }).then(res => {
          console.log('success', res.data)
          this.props.getUserProfile(this.props.userProfile.username)
      }).catch(err => {
          console.log('error', err)
      })
  }

  clearUserInput() {
    this.setState({
      updatedUsername: null,
      updatedWeeklyLimit: null
    })
  }

  handleClose() {
    this.setState({
      openUpdate: false
    })
  }

  openUpdate() {
    this.setState({
      openUpdate: true
    })
  }

  openCancel() {
    this.setState({
      openCancel: true
    })
  }

  handleCloseCancel() {
    this.setState({
      openCancel: false
    })
  }

  openCancelConfirmation(boolean) {
    this.handleCloseCancel();
    if (boolean) {
      this.setState({
        openCancelConfirmation: true
      }); 
    } else {
      this.setState({
        openUnconfirmed: true
      });
    }
  }

  handleCloseConfirmed() {
    if (this.state.openCancelConfirmation) {
      this.setState({
        openCancelConfirmation: false
      });   
    } else {
      this.setState({
        openUnconfirmed: false
      })
    }
  }

  changeUserInfo(username, limit) {
    if (username === '' && limit === '') {
      console.log('Please enter a username or limit');
    } else if (limit === '' && isNaN(Number(limit)) && Number(limit) > 100) {
      console.log('Please enter a number under 100');
    } else {
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
  }

  submitUpdate(username, limit) {
    if (username === '' && limit === '') {
      console.log('Please enter a username or limit');
    } else if (limit === '' && isNaN(Number(limit)) && Number(limit) > 100) {
      console.log('Please enter a number under 100');
    } else {
      axios.post('/updateUser', {
        id: this.state.userProfile._id,
        username: username,
        limit: limit
      })
      .then(res =>
        console.log('yeahhhhhhh', res.data)
      )
    }
    this.handleClose()
  }

  cancelSubscription() {
    axios.post('/cancelSubscription', {
      username: this.props.userProfile.username
    })
      .then(data => {
        console.log('data from cancelSubscription:', data);
        this.openCancelConfirmation(true);
      })
      .catch(err => {
        console.log('error cancelling subsciption:', err);
        this.openCancelConfirmation(false);
      });
  }

  render() {
    const styles = {
      main: {
        display: 'grid',
        height: '100%',
        gridTemplateRows: 'repeat(5, 1fr)'
      },
      flexButton: {
        flex: 1,
        flexDirection: 'row-reverse',
        display:'flex',
        justifyContent: 'flex-start',
        paddingRight: 15.85
      },
      button: {
        display: ''
      }

    }
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
          this.handleClose('openLogin'), this.clearUserInput();
        }}
      />,
      <FlatButton
        label='Submit'
        primary={true}
        keyboardFocused={false}
        onClick={(e) => { e.preventDefault(); this.changeUserInfo(this.state.updatedUsername, this.state.updatedWeeklyLimit) }}
      />,
    ];

    const cancel = [
      <FlatButton
        label='Go Back'
        primary={true}
        keyboardFocused={false}
        onClick={(e) => {e.preventDefault(); this.handleCloseCancel()}}
      />,
      <FlatButton
       label='Cancel Subscription'
       primary={true}
       keyboardFocused={false}
       onClick={(e) => {e.preventDefault(); this.cancelSubscription()}}
      />
    ];

    const confirmed = [
      <FlatButton
        label='Close'
        primary={true}
        keyboardFocused={false}
        onClick={(e) => {e.preventDefault(); this.handleCloseConfirmed()}}
      />
    ];

    const unconfirmed = [
      <FlatButton
        label='Close'
        primary={true}
        keyboardFocused={false}
        onClick={(e) => {e.preventDefault(); this.handleCloseConfirmed()}}
      />
    ];

    return (
        <div style={styles.main}>
          Hey {this.props.userProfile.username}!          
          <div>Email: {this.props.userProfile.email}</div>
          <div>Weekly Limit: {this.props.userProfile.maxWeeklyPlans}</div>
          <StripeCheckout
            name="TrumpChange"
            description="Enter Your Card Info Below"
            panelLabel="Submit"
            allowRememberMe={false}
            token= {this.props.userProfile.subscriberID ? this.onTokenUpdateCard : this.props.onToken} 
            email={this.props.userProfile.email}
            currency="USD"
            stripeKey="pk_test_t7nLVLP2iJEh2FegQRUPKt5p" 
          >
          <button
          type="submit"
          value="Submit">{this.props.userProfile.subscriberID ? 'Update' : 'Enter'} Payment Method 
          </button>
          </StripeCheckout> 
          <Dialog
            title='Update username and/or email'
            actions={update}
            modal={false}
            open={this.state.openUpdate}
            onRequestClose={(e) => { this.handleClose(); this.clearUserInput() }}
          />
          <Dialog 
            title="Confirm Subscription Cancelation"
            actions={cancel}
            modal={false}
            open={this.state.openCancel}
          />
          <Dialog
            title="Subscription Canceled"
            modal={false}
            actions={confirmed}
            open={this.state.openCancelConfirmation}
            onRequestClose={(e) => {this.handleCloseConfirmed()}}
          />
          <Dialog
            title="Error canceling subscription. Please try again."
            modal={false}
            actions={unconfirmed}
            open={this.state.openUnconfirmed}
            onRequestClose={(e) => {this.handleCloseConfirmed()}}
          />
          <div>
            <RaisedButton
              style={{margin: 7.925}}
              labelColor={white}
              backgroundColor={blueA400}
              label='Update My Profile'
              onClick={this.openUpdate.bind(this)}
            />
            <RaisedButton 
              style={{margin: 7.925}}
              labelColor={white}
              backgroundColor={red500}
              label='Cancel Subscription'
              onClick={this.openCancel.bind(this)}
            />
          </div>
        </div>
    )
  }
}

export default UserProfile;




