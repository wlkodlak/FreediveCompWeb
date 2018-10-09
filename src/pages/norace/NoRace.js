import React from 'react';
import Api from '../../api/Api';
import { H1, UL, Toaster, Toast, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

class NoRace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      canCreate: false,
      errors: []
    };
    this.onRacesLoaded = this.onRacesLoaded.bind(this);
    this.onUserVerified = this.onUserVerified.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    Api.getGlobalSearch().then(this.onRacesLoaded).catch(this.onError);
    Api.getAuthVerify("global").then(this.onUserVerified).catch(this.onError);
  }

  onRacesLoaded(races) {
    this.setState({
      races: races
    });
  }

  onUserVerified() {
    this.setState({
      canCreate: true
    });
  }

  onError(error) {
    const errors = this.state.errors.slice(0);
    errors.push(error.message);
    this.setState({
      errors: errors
    });
  }

  onErrorDismissed(index) {
    const errors = this.state.errors.slice(0);
    errors.splice(index, 1);
    this.setState({
      errors: errors
    });
  }

  render() {
    const newRaceId = Api.getNewRaceId();
    return (
      <div>
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <H1>Welcome to FreediveComp app!</H1>
        <p>To start, please create a new competition or select one of the existing ones:</p>
        <UL>
          { this.state.races.map(race => (
            <li key={race.RaceId}>
              <Link to={`/${race.RaceId}/homepage`}>{race.Name}</Link>
            </li>
          )) }
          { this.state.canCreate && (
            <li key="new">
              <Link to={`/${newRaceId}/create`}>Create new competition</Link>
            </li>
          )}
        </UL>
      </div>
    );
  }
}

export default NoRace;
