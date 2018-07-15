import React from 'react';
import { Button } from '@blueprintjs/core';
import NewRaceSettings from './NewRaceSettings';
import AthleteCategories from './AthleteCategories';
import NewRaceStaSettings from './NewRaceStaSettings';
import NewRaceDynSettings from './NewRaceDynSettings';
import NewRaceCwtSettings from './NewRaceCwtSettings';
import Api from '../../api/Api';
import NewRaceSetupGenerator from './NewRaceSetupGenerator';

class CreateRace extends React.Component {
  constructor(props) {
    super(props);
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.onCategoriesChanged = this.onCategoriesChanged.bind(this);
    this.onStaChanged = this.onStaChanged.bind(this);
    this.onDynChanged = this.onDynChanged.bind(this);
    this.onCwtChanged = this.onCwtChanged.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  state = {
    created: false,
    error: null,
    raceSettings: NewRaceSettings.createSettings(),
    athleteCategories: [],
    staSettings: NewRaceStaSettings.createSettings(),
    dynSettings: NewRaceDynSettings.createSettings(),
    cwtSettings: NewRaceCwtSettings.createSettings()
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
    const setupRaceBody = new NewRaceSetupGenerator(raceId, this.state);
    RemoteApi.postSetupRace(, setupRaceBody)
      .then(response => this.setState({created: true}))
      .catch(error => this.setState({error}));
  }

  render() {
    return (
      <div>
        <h1>Create competition</h1>
        <form onSubmit={this.onFormSubmit}>
          <NewRaceSettings value={this.state.raceSettings} onChange={this.onSettingsChanged} />
          <AthleteCategories value={this.state.athleteCategories} onChange={this.onCategoriesChanged} />
          <NewRaceStaSettings value={this.state.staSettings} onChange={this.onStaChanged} />
          <NewRaceDynSettings value={this.state.dynSettings} onChange={this.onDynChanged} />
          <NewRaceCwtSettings value={this.state.cwtSettings} onChange={this.onCwtChanged} />
          <Button type="submit" text="Create competition" />
        </form>
      </div>
    );
  }
}

export default CreateRace;
