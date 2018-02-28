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
      openUpdate: false
    }
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

  render() {
    const styles = {
      main: {
        display: 'grid',
        height: '100%',
        gridTemplateRows: 'repeat(5, 1fr)'
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
          value="Submit">Enter or Update Payment Method
          </button>
          </StripeCheckout> 
          <Dialog
            title='Update username and/or email'
            actions={update}
            modal={false}
            open={this.state.openUpdate}
            onRequestClose={(e) => { this.handleClose(); this.clearUserInput() }}
          />
          <button onClick={this.openUpdate.bind(this)}>Update My Profile</button>
      </div>
    )
  }
}

export default UserProfile;




