import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import StripeCheckout from 'react-stripe-checkout';
//import FadeIn from 'react-fade-in'

class UserProfile extends React.Component {
  constructor(props) {
      super(props)
      this.state= {

      }
  }

  componentDidMount() {
      console.log('mounteddd')
  }

  render() {
      return(
          this.props.userProfile ? 
          <div>
              <div>{this.props.username}</div>
              hey {this.props.userProfile.username}!


              {!this.props.userProfile.subscriberID ? 
              
              <StripeCheckout
              name="TrumpChange"
              description="Enter Your Card Info Below"
              panelLabel="Submit"
              allowRememberMe={false}
              //amount=''
              token={this.props.onToken}
              email={this.props.userProfile.email}
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
            
            :
            
            <div>nothing</div>}

              <button>update my info</button>
              <div>Email: {this.props.userProfile.email}</div>
              <div>Limit: {this.props.userProfile.maxWeeklyPlans}</div>
          </div>

          : <div>Please Login to Your profile</div>
      )
  }
}

export default UserProfile;




