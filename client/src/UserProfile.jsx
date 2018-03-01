import React from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
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
    }
  }

  render() {
    const styles = {
      main: {
        display: 'grid',
        height: '100%',
        gridTemplateRows: 'repeat(5, 1fr)'
      }
    }

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
            token={this.props.onToken}
            email={this.props.userProfile.email}
            currency="USD"
            stripeKey="pk_test_t7nLVLP2iJEh2FegQRUPKt5p" 
          >
          <button
            type="submit"
            value="Submit"> {this.props.userProfile.subscriberID ? 'Update' : 'Enter'} Payment Method
          </button>
          </StripeCheckout> 
          <button onClick={() => this.props.handleOpen('openUpdate')}>Update My Profile</button>
      </div>
    )
  }
}

export default UserProfile;



