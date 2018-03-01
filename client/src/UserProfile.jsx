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
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';


class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      updatedUsername: '',
      updatedWeeklyLimit: '',
      openCancel: false,
      openCancelConfirmation: false,
      openUnconfirmed: false,
      cancelClicked: false
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
        openCancelConfirmation: true,
        canceled: true
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
        height: '60px',
        gridTemplateRows: 'repeat(5, 1fr)',
        alignItems: 'center',
        fontWeight: 80
        // fontSize: 20
        // margin: 7.925
      },
      // flexButton: {
      //   flex: 1,
      //   flexDirection: 'row-reverse',
      //   display:'flex',
      //   justifyContent: 'flex-start',
      //   paddingRight: 15.85
      // },
      button: {
        display: 'grid',
        heigth: '30%'
      },
      paper: {
        textAlign: 'center',
        margin: 0,
        padding: 8
      },
      info: {
        height: '40px',
        textAlign: 'center',
        padding: 10
      },
      all: {
        marginLeft: 10,
        marginRight: 10
      },
      heading: {
        // padding: 40,
        display: 'grid',
        height: '60px',
        gridTemplateRows: 'repeat(5, 1fr)',
        alignItems: 'center',
        fontSize: 30
      }
    }
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
       onClick={(e) => {e.preventDefault(); this.cancelSubscription(); 
         this.setState({
           cancelClicked: true
         })}}
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

    const spinny = [
      <div>
        <CircularProgress size={80} thickness={5} color={blue400}/>
      </div>
    ];

    return (
        <div style={styles.main}>
        <Paper style={styles.paper}>
          <div style={styles.heading}>
            Hey {this.props.userProfile.username}!
          </div>
        </Paper>
        <Paper>
          <div style={styles.info}>Email: {this.props.userProfile.email}</div>
        </Paper>  
        <Paper>
          <div style={styles.info}>Weekly Limit: {this.props.userProfile.maxWeeklyPlans}</div>
          </Paper>
          <Dialog 
            title="Confirm Subscription Cancelation"
            actions={this.state.cancelClicked ? spinny : cancel}
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
          <Paper>
            <div style={styles.button}>
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
                <RaisedButton
                  style={{marginBottom: 7.925, display: 'grid'}}
                  labelColor={white}
                  backgroundColor={blueA400}
                  label={this.props.userProfile.subscriberID ? 'Update Payment Method' : 'Enter Payment Method'}  
                />
              </StripeCheckout> 
              <RaisedButton
                style={{marginBottom: 7.925}}
                labelColor={white}
                backgroundColor={blueA400}
                label='Update My Profile'
                onClick={() => this.props.handleOpen('openUpdate')}
              />
              <RaisedButton 
                style={{marginBottom: 7.925}}
                labelColor={white}
                backgroundColor={red500}
                label='Cancel Subscription'
                onClick={this.openCancel.bind(this)}
              />
            </div>
          </Paper>
        </div>
    )
  }
}

export default UserProfile;




