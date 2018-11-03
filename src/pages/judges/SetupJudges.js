import React from 'react';
import Api from '../../api/Api';
import ConnectCodeForm from './ConnectCodeForm';
import JudgesList from './JudgesList';
import RaceHeader from '../homepage/RaceHeader';
import { Toaster, Toast, Intent } from '@blueprintjs/core';

class SetupJudges extends React.Component {
  constructor(props) {
    super(props);
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onJudgesLoaded = this.onJudgesLoaded.bind(this);
    this.onAuthorizeDeviceRequested = this.onAuthorizeDeviceRequested.bind(this);
    this.onAuthorizeDeviceFinished = this.onAuthorizeDeviceFinished.bind(this);
    this.onUnauthorizeDevicesRequested = this.onUnauthorizeDevicesRequested.bind(this);
    this.onError = this.onError.bind(this);
  }

  state = {
    judges: [],
    errors: []
  }

  componentDidMount() {
    const raceId = this.props.raceId;
    Api.getRaceSetup(raceId).then(this.onRaceSetupLoaded).catch(this.onError);
    Api.getAuthJudges(raceId).then(this.onJudgesLoaded).catch(this.onError);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      raceName: raceSetup.Race.Name
    });
  }

  onJudgesLoaded(judges) {
    this.setState({judges});
  }

  onError(error) {
    const errors = this.state.errors.slice(0);
    errors.push(error.message);
    this.setState({
      errors: errors
    });
  }

  onErrorDismissed(index) {
    const errors = this.state.errors.slice(0);
    errors.splice(index, 1);
    this.setState({
      errors: errors
    });
  }

  onAuthorizeDeviceRequested(judgeId, judgeName, connectCode) {
    const raceId = this.props.raceId;
    const authorizeRequest = {
      "JudgeId": judgeId,
      "JudgeName": judgeName,
      "ConnectCode": connectCode
    };
    Api.postAuthAuthorize(raceId, authorizeRequest).then(this.onAuthorizeDeviceFinished).catch(this.onError);
  }

  onAuthorizeDeviceFinished(newJudge) {
    const judges = this.state.judges.slice(0);
    const existingIndex = judges.findIndex(judge => judge.JudgeId === newJudge.JudgeId);
    if (existingIndex < 0) {
      judges.push(newJudge);
    } else {
      judges[existingIndex] = newJudge;
    }
    this.setState({judges});
  }

  onUnauthorizeDevicesRequested(judge) {
    const raceId = this.props.raceId;
    const unauthorizeRequest = {
      "JudgeId": judge.JudgeId
    };
    Api.postAuthUnauthorize(raceId, unauthorizeRequest).then(this.onAuthorizeDeviceFinished).catch(this.onError);
  }

  render() {
    return (
      <div className="judges-form">
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <RaceHeader raceId={this.props.raceId} />
        <h1>Setup Judges</h1>
        <JudgesList
          judges={this.state.judges}
          onUnauthorizeDevicesRequested={this.onUnauthorizeDevicesRequested} />
        <ConnectCodeForm
          judges={this.state.judges}
          onAuthorizeDeviceRequested={this.onAuthorizeDeviceRequested} />
      </div>
    );
  }
}

export default SetupJudges;
