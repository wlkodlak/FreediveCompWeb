import React from 'react';
import { FormGroup, ControlGroup, InputGroup, Button, HTMLSelect, HTMLTable, H5 } from '@blueprintjs/core';
import Api from '../../api/Api';

class SetupJudges extends React.Component {
  constructor(props) {
    super(props);
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onJudgesLoaded = this.onJudgesLoaded.bind(this);
    this.onNewJudgeNameChanged = this.onNewJudgeNameChanged.bind(this);
    this.onConnectCodeChanged = this.onConnectCodeChanged.bind(this);
  }

  state = {
    raceName = "",
    judges = [],
    newJudgeName = "",
    connectCode = ""
  }

  componentWillMount() {
    const raceId = this.props.raceId;
    Api.getRaceSetup(raceId).then(this.onRaceSetupLoaded);
    Api.getAuthJudges(raceId).then(this.onJudgesLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      raceName:raceSetup.Race.Name
    });
  }

  onJudgesLoaded(judges) {
    this.setState({judges});
  }

  onNewJudgeNameChanged(newJudgeName) {
    this.setState({newJudgeName});
  }

  onConnectCodeChanged(connectCode) {
    this.setState({connectCode});
  }

  render() {
    return (
      <div>
        <h1>Setup Judges</h1>
        <JudgesList
          judges={this.state.judges}
          newJudgeName={this.state.newJudgeName}
          onNewJudgeNameChange={this.onNewJudgeNameChanged}
          onNewJudgeClick={this.onNewJudgeClick} />
        <ConnectCodeForm
          judges={this.state.judges}
          connectCode={this.state.connectCode}
          onJudgeChange={this.on}
          onConnectCodeChange={this.onConnectCodeChanged} />
      </div>
    );
  }
}

export default SetupJudges;
