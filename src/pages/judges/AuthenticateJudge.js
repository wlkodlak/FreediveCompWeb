import React from 'react';
import Api from '../../api/Api';
import { Redirect } from 'react-router-dom';

class AuthenticateJudge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      connectCode: null
    };
    this.onAuthenticateSucceeded = this.onAuthenticateSucceeded.bind(this);
    this.onTimer = this.onTimer.bind(this);
  }

  componentDidMount() {
    this.onTimer();
    this.startTimer();
  }

  startTimer() {
    if (!this.timerId) {
      this.timerId = setInterval(this.onTimer, 5000);
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  onTimer() {
    Api
      .postAuthAuthenticate(this.props.raceId, this.state.connectCode)
      .then(this.onAuthenticateSucceeded)
      .catch(this.props.onError);
  }

  onAuthenticateSucceeded(response) {
    const token = response.AuthenticationToken;
    const connectCode = response.ConnectCode;
    if (token && token.length > 0) {
      this.setState({
        verified: true
      });
    } else if (connectCode) {
      this.setState({
        connectCode: connectCode
      });
    }
  }

  render() {
    if (this.state.verified) {
      return (<Redirect to={`/${this.props.raceId}/homepage`} />);
    } else {
      const raceSetup = this.props.raceSetup;
      const raceName = raceSetup ? raceSetup.Race.Name : "the competition";
      return (
        <div className="judges-form">
          <div className="judges-authenticate-message">You are not paired with {raceName}. Show this code to the administrator:</div>
          <div className="judges-authenticate-code">{this.state.connectCode}</div>
        </div>
      );
    }
  }
}

export default AuthenticateJudge;
