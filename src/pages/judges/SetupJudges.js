import React from 'react';
import Api from '../../api/Api';
import ConnectCodeForm from './ConnectCodeForm';
import JudgesList from './JudgesList';

class SetupJudges extends React.Component {
  constructor(props) {
    super(props);
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onJudgesLoaded = this.onJudgesLoaded.bind(this);
    this.onAuthorizeDeviceRequested = this.onAuthorizeDeviceRequested.bind(this);
  }

  state = {
    judges: []
  }

  componentWillMount() {
    const raceId = this.props.raceId;
    Api.getRaceSetup(raceId).then(this.onRaceSetupLoaded);
    Api.getAuthJudges(raceId).then(this.onJudgesLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      raceName: raceSetup.Race.Name
    });
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
    Api.postAuthAuthorize(raceId, authorizeRequest).then(this.onAuthorizeDeviceFinished);
  }

  onAuthorizeDeviceFinished(newJudge) {
    const judges = this.state.judges.slice(0);
    const existingIndex = judges.findIndex(judge => judge.JudgeId = newJudge.JudgeId);
    if (existingIndex < 0) {
      judges.push(newJudge);
    } else {
      judges[existingIndex] = newJudge;
    }
    this.setState({judges});
  }

  render() {
    return (
      <div>
        <h1>Setup Judges</h1>
        <JudgesList
          judges={this.state.judges} />
        <ConnectCodeForm
          judges={this.state.judges}
          onAuthorizeDeviceRequested={this.onAuthorizeDeviceRequested} />
      </div>
    );
  }
}

export default SetupJudges;
