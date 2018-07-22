import React from 'react'
import { UL } from '@blueprintjs/core'
import { Link } from 'react-router-dom'

class StartingLanesListLevel extends React.Component {
  render() {
    return (
      <UL>
        {
          this.props.startingLanes.map(lane => {
            const hasSublanes = lane.SubLanes && lane.SubLanes.length > 0;
            const laneId = lane.StartingLaneId;
            const laneName = lane.ShortName;
            const laneLink = hasSublanes ? null : `${raceId}/startinglists/${laneId}`;
            return (
              <li key={laneId}>
                <Link to={laneLink}>{laneName}</Link>
                { hasSublanes && <StartingLanesListLevel startingLanes={lane.SubLanes} />}
              </li>
            );
          })
        }
      </UL>
    );
  }
}

export default StartingLanesListLevel;
