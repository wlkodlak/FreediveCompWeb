import React from 'react';
import Api from '../../api/Api';
import { H1, UL } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

class NoRace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      canCreate: false
    };
    this.onRacesLoaded = this.onRacesLoaded.bind(this);
  }

  componentWillMount() {
    Api.getGlobalSearch().then(this.onRacesLoaded);
  }

  onRacesLoaded(races) {
    this.setState({
      races: races,
      canCreate: true // this should probably be checked using some new API call
    });
  }

  render() {
    const newRaceId = Api.getNewRaceId();
    return (
      <div>
        <H1>Welcome to FreediveComp app!</H1>
        <p>To start, please create a new competition or select one of the existing ones:</p>
        <UL>
          { this.state.races.map(race => (
            <li key={race.RaceId}>
              <Link to={`/${race.RaceId}/homepage`}>{race.Name}</Link>
            </li>
          )) }
          <li>
            <Link to={`/${newRaceId}/create`}>Create new competition</Link>
          </li>
        </UL>
      </div>
    );
  }
}

export default NoRace;
