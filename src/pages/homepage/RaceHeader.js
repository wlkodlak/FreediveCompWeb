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
    return (
      <Link to={`/${raceId}/homepage`}><H2>{raceName}</H2></Link>
    );
  }
}

export default RaceHeader;
