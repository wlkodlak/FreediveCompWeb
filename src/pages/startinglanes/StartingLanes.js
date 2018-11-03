import React from 'react';
import { H1 } from '@blueprintjs/core';
import StartingLanesListLevel from './StartingLanesListLevel';

class StartingLanes extends React.Component {
  render() {
    const raceSetup = this.props.raceSetup;
    const startingLanes = raceSetup == null ? [] : raceSetup.StartingLanes;
    return (
      <div className="startinglanes-list">
        <H1>Starting lanes</H1>
        <StartingLanesListLevel
          raceId={this.props.raceId}
          startingLanes={startingLanes} />
      </div>
    );
  }
}

export default StartingLanes;
