import React from 'react';
import Api from '../../api/Api';
import RaceHeader from '../homepage/RaceHeader';
import { Toaster, Toast, Intent } from '@blueprintjs/core';
import { Redirect } from 'react-router-dom';

class AuthenticateJudge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      raceName: null,
      connectCode: null,
      errors: []
    };
    this.onRaceLoaded = this.onRaceLoaded.bind(this);
    this.onAuthenticateSucceeded = this.onAuthenticateSucceeded.bind(this);
    this.onError = this.onError.bind(this);
    this.onTimer = this.onTimer.bind(this);
  }

  componentDidMount() {
    Api
      .getRaceSetup(this.props.raceId)
      .then(this.onRaceLoaded)
      .catch(this.onError);
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

  onRaceLoaded(raceSetup) {
    this.setState({
      raceName: raceSetup.Race.Name
    });
  }

  onTimer() {
    Api
      .postAuthAuthenticate(this.props.raceId, this.state.connectCode)
      .then(this.onAuthenticateSucceeded)
      .catch(this.onError);
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

  onError(error) {
    const errors = this.state.errors.slice(0);
    errors.push(error.message);
    this.stopTimer();
    this.setState({
      errors: errors
    });
  }

  onErrorDismissed(index) {
    const errors = this.state.errors.slice(0);
    errors.splice(index, 1);
    this.startTimer();
    this.setState({
      errors: errors
    });
  }

  render() {
    if (this.state.verified) {
      return (<Redirect to={`/${this.props.raceId}/startinglists`} />);
    } else {
      return (
        <div className="judges-form">
          <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
          <RaceHeader raceId={this.props.raceId} />
          <div className="judges-authenticate-message">You are not paired with {this.state.raceName}. Show this code to the administrator:</div>
          <div className="judges-authenticate-code">{this.state.connectCode}</div>
        </div>
      );
    }
  }
}

export default AuthenticateJudge;
