import React from 'react';
import { H1, Toaster, Toast, Intent } from '@blueprintjs/core';
import StartingLanesListLevel from './StartingLanesListLevel';
import Api from '../../api/Api';
import RaceHeader from '../homepage/RaceHeader';

class StartingLanes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raceSetup: null,
      errors: []
    };
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentWillMount() {
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
    const raceSetup = this.state.raceSetup;
    const startingLanes = raceSetup == null ? [] : raceSetup.StartingLanes;
    return (
      <div className="startinglanes-list">
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <RaceHeader raceId={this.props.raceId} />
        <H1>Starting lanes</H1>
        <StartingLanesListLevel
          raceId={this.props.raceId}
          startingLanes={startingLanes} />
      </div>
    );
  }
}

export default StartingLanes;
