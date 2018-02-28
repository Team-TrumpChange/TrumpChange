import React from 'react';
import ReactDOM from 'react-dom';

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userProfile: this.props.userProfile

    }
  }

  render() {
    return (
      <div>
        {this.state.userProfile === undefined ? 'Loading...' : this.state.userProfile.customerID}
      </div>
    )
  }
}

export default UserProfile;