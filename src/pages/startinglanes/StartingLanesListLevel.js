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
            if (hasSublanes) {
              return (
                <li key={laneId}>
                  <span className="startingLanesGroup">{laneName}</span>
                  <StartingLanesListLevel startingLanes={lane.SubLanes} />
                </li>
              );
            } else {
              <li key={laneId}>
                <Link to={laneLink} className="startingLanesGroup">{laneName}</Link>
              </li>
            }
          })
        }
      </UL>
    );
  }
}

export default StartingLanes;
