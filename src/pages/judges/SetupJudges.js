import React from 'react';
import Api from '../../api/Api';
import ConnectCodeForm from './ConnectCodeForm';
import JudgesList from './JudgesList';

class SetupJudges extends React.Component {
  constructor(props) {
    super(props);
    this.onJudgesLoaded = this.onJudgesLoaded.bind(this);
    this.onAuthorizeDeviceRequested = this.onAuthorizeDeviceRequested.bind(this);
    this.onAuthorizeDeviceFinished = this.onAuthorizeDeviceFinished.bind(this);
    this.onUnauthorizeDevicesRequested = this.onUnauthorizeDevicesRequested.bind(this);
  }

  state = {
    judges: []
  }

  componentDidMount() {
    const raceId = this.props.raceId;
    Api.getAuthJudges(raceId).then(this.onJudgesLoaded).catch(this.props.onError);
  }

  onJudgesLoaded(judges) {
    this.setState({judges});
  }

  onAuthorizeDeviceRequested(judgeId, judgeName, connectCode) {
    const raceId = this.props.raceId;
    const authorizeRequest = {
      "JudgeId": judgeId,
      "JudgeName": judgeName,
      "ConnectCode": connectCode
    };
    Api.postAuthAuthorize(raceId, authorizeRequest).then(this.onAuthorizeDeviceFinished).catch(this.props.onError);
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
    Api.postAuthUnauthorize(raceId, unauthorizeRequest).then(this.onAuthorizeDeviceFinished).catch(this.props.onError);
  }

  render() {
    return (
      <div className="judges-form">
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
