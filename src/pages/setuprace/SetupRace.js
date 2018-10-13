import React from 'react';
import Api from '../../api/Api';
import RaceHeader from '../homepage/RaceHeader';
import { Toaster, Toast, Intent } from '@blueprintjs/core';

class SetupRace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      raceSettings: {},
      startingLanes: [],
      disciplines: [],
      resultsLists: []
    }
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.onError);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      status: "ready",
      raceSettings: raceSetup.Race,
      startingLanes: raceSetup.StartingLanes,
      disciplines: raceSetup.Disciplines,
      resultsLists: raceSetup.ResultsLists
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
    return (
      <div className="judges-form">
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <RaceHeader raceId={this.props.raceId} />
        <h1>Setup Competition</h1>
      </div>
    );
  }
}
