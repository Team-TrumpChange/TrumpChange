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
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


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
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '75vh',
      },
   
      button: {
        display: 'grid',
        heigth: '30%'
      },
      card: {
        flex: 'auto'
      },
      image: {
        heigth: '20px'
      },
      cardText:  {
        fontSize: 20,
      },
      cardHeader: {
        fontsize: 24
      },
      email: {
        margin: 15
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
          <Card>
            <CardHeader
              style={styles.cardHeader}
              title="My Profile"
            />
            <CardMedia
              overlay={<CardTitle title={this.props.userProfile.username} />}
            > 
              <img 
                style={styles.image} 
                src="https://help.twitter.com/content/dam/help-twitter/big-bird-card.jpeg" 
                alt="" 
              />
            </CardMedia>
            <CardTitle title={this.props.userProfile.totalMoneyDonated ? 'Total Donated: $' + this.props.userProfile.totalMoneyDonated
              : 'Total Donated: $0'
              } />
            <CardText style={styles.cardText}>
             Email: {this.props.userProfile.email} 
             <br></br>
             Weekly Donation Limit: {this.props.userProfile.maxWeeklyPlans}
            </CardText>
            <CardActions>
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
                    backgroundColor={blue400}
                    label={this.props.userProfile.subscriberID ? 'Update Payment Method' : 'Enter Payment Method'}  
                  />
                </StripeCheckout> 
                <RaisedButton
                  style={{marginBottom: 7.925}}
                  labelColor={white}
                  backgroundColor={blue400}
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
            </CardActions>
          </Card>
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
          <div style={styles.email}>
            email us: trumpchange2 at gmail.com
          </div>
        </div>
    )
  }
}

export default UserProfile;




