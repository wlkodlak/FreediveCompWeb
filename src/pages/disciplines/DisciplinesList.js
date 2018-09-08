import React from 'react';
import { H1, UL, Toaster, Toast, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';
import RaceHeader from '../homepage/RaceHeader';

class DisciplinesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raceSetup: null,
      errors: []
    };
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.onError);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({raceSetup});
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
    const raceId = this.props.raceId;
    const raceSetup = this.state.raceSetup;
    const disciplines = raceSetup == null ? [] : raceSetup.Disciplines;
    return (
      <div className="disciplines-list">
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <RaceHeader raceId={this.props.raceId} />
        <H1>Disciplines</H1>
        <UL>
          {
            disciplines.map(discipline => {
              const id = discipline.DisciplineId;
              const name = discipline.LongName;
              return (
                <li key={id}>
                  <Link to={`/${raceId}/disciplines/${id}`}>{name}</Link>
                </li>
              );
            })
          }
        </UL>
      </div>
    );
  }
}

export default DisciplinesList;
