import React from 'react';
import { H2 } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';

class RaceHeader extends React.Component {
  constructor(props) {
    super(props);
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.state = {
      raceName: "Competition"
    };
  }

  componentWillMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      raceName: raceSetup.Race.Name
    });
  }

  render() {
    const raceId = this.props.raceId;
    const raceName = this.state.raceName;
    const groupPath = this.props.page;
    const groupName = this.props.pageName;
    return (
      <div>
        <H2>
          <Link to={`/${raceId}/homepage`} className="headerLink">{raceName}</Link>
          { groupPath && " - "}
          { groupPath && <Link to={`/${raceId}/${groupPath}`} className="headerLink">{groupName}</Link> }
        </H2>
      </div>
    );
  }
}

export default RaceHeader;
