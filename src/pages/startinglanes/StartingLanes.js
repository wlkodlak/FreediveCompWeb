import React from 'react'
import { H1 } from '@blueprintjs/core'
import StartingLanesListLevel from './StartingLanesListLevel'

class StartingLanes extends React.Component {
  state = {
    raceSetup: null
  }

  componentWillMount() {
    Api.getRaceSetup(raceId).then(this.onRaceSetupLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({raceSetup});
  }

  render() {
    return (
      <div>
        <H1>Starting lanes</H1>
        <StartingLanesListLevel
          startingLanes={this.state.raceSetup.StartingLanes} />
      </div>
    );
  }
}

export default StartingLanes;
