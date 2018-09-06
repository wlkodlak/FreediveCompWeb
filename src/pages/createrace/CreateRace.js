import React from 'react';
import { H1, Button, Toaster, Toast, Intent } from '@blueprintjs/core';
import NewRaceSettings from './NewRaceSettings';
import AthleteCategories from './AthleteCategories';
import NewRaceStaSettings from './NewRaceStaSettings';
import NewRaceDynSettings from './NewRaceDynSettings';
import NewRaceCwtSettings from './NewRaceCwtSettings';
import Api from '../../api/Api';
import NewRaceSetupGenerator from './NewRaceSetupGenerator';
import { Redirect } from 'react-router-dom';

class CreateRace extends React.Component {
  constructor(props) {
    super(props);
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.onCategoriesChanged = this.onCategoriesChanged.bind(this);
    this.onStaChanged = this.onStaChanged.bind(this);
    this.onDynChanged = this.onDynChanged.bind(this);
    this.onCwtChanged = this.onCwtChanged.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onError = this.onError.bind(this);
  }

  state = {
    created: false,
    raceSettings: NewRaceSettings.createSettings(),
    athleteCategories: [],
    staSettings: NewRaceStaSettings.createSettings(),
    dynSettings: NewRaceDynSettings.createSettings(),
    cwtSettings: NewRaceCwtSettings.createSettings(),
    errors: []
  }

  onSettingsChanged(raceSettings) {
    this.setState({raceSettings});
  }

  onCategoriesChanged(athleteCategories) {
    this.setState({athleteCategories});
  }

  onStaChanged(staSettings) {
    this.setState({staSettings});
  }

  onDynChanged(dynSettings) {
    this.setState({dynSettings});
  }

  onCwtChanged(cwtSettings) {
    this.setState({cwtSettings});
  }

  onFormSubmit(event) {
    event.preventDefault();
    const raceId = this.props.raceId;
    const raceSetup = new NewRaceSetupGenerator(raceId, this.state).buildRaceSetupDto();
    Api.postRaceSetup(raceId, raceSetup)
      .then(response => this.setState({created: true}))
      .catch(this.onError);
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
    if (this.state.created) {
      return (<Redirect to={`/${this.props.raceId}/homepage`} />);
    } else {
      return (
        <form onSubmit={this.onFormSubmit} className="createrace-form">
          <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
          <H1>Create competition</H1>
          <NewRaceSettings value={this.state.raceSettings} onChange={this.onSettingsChanged} />
          <AthleteCategories value={this.state.athleteCategories} onChange={this.onCategoriesChanged} />
          <NewRaceStaSettings value={this.state.staSettings} onChange={this.onStaChanged} />
          <NewRaceDynSettings value={this.state.dynSettings} onChange={this.onDynChanged} />
          <NewRaceCwtSettings value={this.state.cwtSettings} onChange={this.onCwtChanged} />
          <Button type="submit" text="Create competition" className="createrace-submit" />
        </form>
      );
    }
  }
}

export default CreateRace;
