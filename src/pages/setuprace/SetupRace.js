import React from 'react';
import Api from '../../api/Api';
import { Button } from '@blueprintjs/core';
import moment from 'moment';
import SetupRaceTitle from './SetupRaceTitle';
import SetupRaceSettings from './SetupRaceSettings';
import SetupRaceStartingLanes from './SetupRaceStartingLanes';
import SetupRaceDisciplines from './SetupRaceDisciplines';
import SetupRaceResultsLists from './SetupRaceResultsLists';

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
    this.onRaceSettingsChanged = this.onRaceSettingsChanged.bind(this);
    this.onStartingLanesChanged = this.onStartingLanesChanged.bind(this);
    this.onDisciplinesChanged = this.onDisciplinesChanged.bind(this);
    this.onResultsListsChanged = this.onResultsListsChanged.bind(this);
    this.onConfirmChanges = this.onConfirmChanges.bind(this);
    this.onChangesConfirmed = this.onChangesConfirmed.bind(this);
  }

  componentDidMount() {
    /* This component needs to be absolutely sure about the race setup,
       that's why it does not use race setup from props. Plus we are
       modifying that data. */
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.props.onError);
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

  isLoaded() {
    return this.state.status !== "loading";
  }

  getRaceSettingsSummary() {
    const raceSettings = this.state.raceSettings;
    if (!this.isLoaded() || !raceSettings) return "";
    const name = raceSettings.Name;
    const startFormatted = raceSettings.Start == null ? "unknown" : moment(raceSettings.Start).format("YYYY-MM-DD");
    const endFormatted = raceSettings.End == null ? "unknown" : moment(raceSettings.End).format("YYYY-MM-DD");
    return name + "\r\n" + startFormatted + " - " + endFormatted;
  }

  onRaceSettingsChanged(raceSettings) {
    this.setState({
      status: "modified",
      raceSettings: raceSettings
    });
  }

  getStartingLanesSummary() {
    const startingLanes = this.state.startingLanes;
    if (!this.isLoaded() || !startingLanes || startingLanes.length === 0) return "";
    return startingLanes.map(l => l.ShortName).join(", ");
  }

  onStartingLanesChanged(startingLanes) {
    this.setState({
      status: "modified",
      startingLanes: startingLanes
    });
  }

  getDisciplinesSummary() {
    const disciplines = this.state.disciplines;
    if (!this.isLoaded() || !disciplines || disciplines.length === 0) return "";
    return disciplines.map(l => l.DisciplineId).join(", ");
  }

  onDisciplinesChanged(disciplines) {
    this.setState({
      status: "modified",
      disciplines: disciplines
    });
  }

  getResultsListsSummary() {
    const resultsLists = this.state.resultsLists;
    if (!this.isLoaded() || !resultsLists || resultsLists.length === 0) return "";
    return resultsLists.map(l => l.ResultsListId).join(", ");
  }

  onResultsListsChanged(resultsLists) {
    this.setState({
      status: "modified",
      resultsLists: resultsLists
    });
  }

  onConfirmChanges() {
    const raceSetup = this.getRaceSetup();
    Api.postRaceSetup(this.props.raceId, raceSetup).then(this.onChangesConfirmed).catch(this.props.onError);
  }

  getRaceSetup() {
    return {
      "Race": this.state.raceSettings,
      "StartingLanes": this.state.startingLanes,
      "Disciplines": this.state.disciplines,
      "ResultsLists": this.state.resultsLists,
    };
  }

  onChangesConfirmed() {
    this.setState({
      status: "ready"
    });
    this.props.onRaceInvalidated();
  }

  onRaceInvalidated() {
    const onRaceInvalidated = this.props.onRaceInvalidated;
    const raceSetup = this.getRaceSetup();
    if (onRaceInvalidated) onRaceInvalidated(raceSetup);
  }

  render() {
    const modified = this.state.status === "modified";
    const isAdmin = this.props.userType === "Admin";
    return (
      <div className="racesetup-form">
        <h1>Setup competition</h1>
        <SetupRaceTitle title="General" summary={this.getRaceSettingsSummary()}>
          <SetupRaceSettings raceSettings={this.state.raceSettings} onChange={this.onRaceSettingsChanged} />
        </SetupRaceTitle>
        <SetupRaceTitle title="Starting lanes" summary={this.getStartingLanesSummary()}>
          <SetupRaceStartingLanes startingLanes={this.state.startingLanes} onChange={this.onStartingLanesChanged} />
        </SetupRaceTitle>
        <SetupRaceTitle title="Disciplines" summary={this.getDisciplinesSummary()}>
          <SetupRaceDisciplines disciplines={this.state.disciplines} onChange={this.onDisciplinesChanged} />
        </SetupRaceTitle>
        <SetupRaceTitle title="Results lists" summary={this.getResultsListsSummary()}>
          <SetupRaceResultsLists
            disciplines={this.state.disciplines}
            resultsLists={this.state.resultsLists}
            onChange={this.onResultsListsChanged} />
        </SetupRaceTitle>
        <Button type="button" text="Confirm changes" onClick={this.onConfirmChanges} disabled={!modified || !isAdmin} />
      </div>
    );
  }
}

export default SetupRace;
