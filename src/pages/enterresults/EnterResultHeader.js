import React from 'react';
import {Link} from 'react-router-dom';
import {FormGroup} from '@blueprintjs/core';
import moment from 'moment';

class EnterResultHeader extends React.Component {
  convertOfficialTop(xmlDateTime) {
    if (typeof xmlDateTime === "string" && xmlDateTime.length >= 19) {
      return moment(xmlDateTime).format("HH:mm");
    } else {
      return "";
    }
  }

  render() {
    const raceId = this.props.raceId;
    const startingLaneId = this.props.startingLaneId;
    const entry = this.props.entry;
    const laneName = this.props.startingLaneName;
    const officialTop = this.convertOfficialTop(entry.Start.OfficialTop);
    const athleteId = entry.Athlete.AthleteId;
    const athleteName = `${entry.Athlete.FirstName} ${entry.Athlete.Surname}`;
    const disciplineName = entry.Discipline.Name;
    const laneLink = `/${raceId}/startinglists/${startingLaneId}`;
    const athleteLink = `/${raceId}/athletes/${athleteId}`;
    return (
      <div className="enterresults-header">
        <FormGroup label="Lane" className="enterresults-lane">
          <Link to={laneLink}>{laneName}</Link>
        </FormGroup>
        <FormGroup label="OT" className="enterresults-ot">
          {officialTop}
        </FormGroup>
        <FormGroup label="Athlete" className="enterresults-athlete">
          <Link to={athleteLink}>{athleteName}</Link>
        </FormGroup>
        <FormGroup label="Discipline" className="enterresults-discipline">
          {disciplineName}
        </FormGroup>
      </div>
    );
  }
}

export default EnterResultHeader;
