import React from 'react';
import { H1 } from '@blueprintjs/core';
import StartingLanesListLevel from './StartingLanesListLevel';
import Api from '../../api/Api';

class StartingLanes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raceSetup: null
    };
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
  }

  componentWillMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({raceSetup});
  }

  render() {
    const raceSetup = this.state.raceSetup;
    const startingLanes = raceSetup == null ? [] : raceSetup.StartingLanes;
    return (
      <div>
        <H1>Starting lanes</H1>
        <StartingLanesListLevel
          raceId={this.props.raceId}
          startingLanes={startingLanes} />
      </div>
    );
  }
}

export default StartingLanes;
