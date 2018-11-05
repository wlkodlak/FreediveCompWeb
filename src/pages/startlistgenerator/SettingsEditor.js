import React from 'react';
import { FormGroup, RadioGroup, Button, InputGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import CheckboxGroup from './CheckboxGroup';
import moment from 'moment';

class SettingsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartingLane: null,
      selectedDisciplines: [],
      firstStart: props.raceStart,
      startInterval: "10",
      breakInterval: "180",
      breakDuration: "30",
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onStartingLaneChanged = this.onStartingLaneChanged.bind(this);
    this.onDisciplinesChanged = this.onDisciplinesChanged.bind(this);
    this.onFirstStartChanged = this.onFirstStartChanged.bind(this);
    this.onStartIntervalChanged = this.onStartIntervalChanged.bind(this);
    this.onBreakIntervalChanged = this.onBreakIntervalChanged.bind(this);
    this.onBreakDurationChanged = this.onBreakDurationChanged.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    try {
      const settings = this.buildSettings();
      this.props.onSettingsConfirmed(settings);
    } catch (e) {
      this.props.onError(e);
    }
  }

  buildSettings() {
    const selectedStartingLane = this.state.selectedStartingLane;
    const selectedDisciplines = this.state.selectedDisciplines;
    const firstStart = this.state.firstStart;
    const startIntervalText = this.state.startInterval;
    const breakIntervalText = this.state.breakInterval;
    const breakDurationText = this.state.breakDuration;

    if (!selectedStartingLane) throw new Error("Missing starting lane");
    if (selectedDisciplines.length === 0) throw new Error("No discipines selected");
    if (!firstStart) throw new Error("Missing time of first start");
    if (!startIntervalText) throw new Error("Missing start interval");

    let startInterval = startIntervalText ? parseInt(startIntervalText, 10) : 15;
    let breakInterval = breakIntervalText ? parseInt(breakIntervalText, 10) : 0;
    let breakDuration = breakDurationText ? parseInt(breakDurationText, 10) : 30;

    if (breakInterval === 0) breakInterval = 999999; // no breaks

    if (startInterval <= 0 || Number.isNaN(startInterval)) throw new Error("Wrong start interval");
    if (breakInterval <= 0 || Number.isNaN(breakInterval)) throw new Error("Wrong break interval");
    if (breakDuration <= 0 || Number.isNaN(breakDuration)) throw new Error("Wrong break duration");

    return {
      selectedStartingLane,
      selectedDisciplines,
      firstStart,
      startInterval,
      breakInterval,
      breakDuration
    };
  }

  onStartingLaneChanged(event) {
    this.setState({
      selectedStartingLane: event.target.value
    });
  }

  onDisciplinesChanged(event) {
    this.setState({
      selectedDisciplines: event.selectedValues
    });
  }

  onStartIntervalChanged(event) {
    this.setState({
      startInterval: event.target.value
    });
  }

  onBreakIntervalChanged(event) {
    this.setState({
      breakInterval: event.target.value
    });
  }

  onBreakDurationChanged(event) {
    this.setState({
      breakDuration: event.target.value
    });
  }

  onFirstStartChanged(firstStart) {
    this.setState({ firstStart });
  }

  formatDate(now) {
    return moment(now).format("YYYY-MM-DD HH:mm");
  }

  parseDate(formatted) {
    return moment(formatted, "YYYY-MM-DD HH:mm").toDate();
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <RadioGroup
          className="startinglanes-generator-lanes"
          label="Starting lane"
          onChange={this.onStartingLaneChanged}
          selectedValue={this.state.selectedStartingLane}
          options={this.renderStartingLaneOptions()}
        />
        <CheckboxGroup
          label="Disciplines"
          onChange={this.onDisciplinesChanged}
          selectedValues={this.state.selectedDisciplines}
          options={this.renderDisciplineOptions()}
        />
        <FormGroup label="First start">
          <DateInput
            placeholder="YYYY-MM-DD hh:mm"
            value={this.state.firstStart}
            onChange={this.onFirstStartChanged}
            formatDate={this.formatDate}
            parseDate={this.parseDate}
            timePrecision="minute"
          />
        </FormGroup>
        <FormGroup label="Start interval (minutes)">
          <InputGroup
            value={this.state.startInterval}
            placeholder="10"
            onChange={this.onStartIntervalChanged}
          />
        </FormGroup>
        <FormGroup label="Break interval (minutes)">
          <InputGroup
            value={this.state.breakInterval}
            placeholder="180"
            onChange={this.onBreakIntervalChanged}
          />
        </FormGroup>
        <FormGroup label="Break duration (minutes)">
          <InputGroup
            value={this.state.breakDuration}
            placeholder="30"
            onChange={this.onBreakDurationChanged}
          />
        </FormGroup>
        <Button type="submit" text="Generate list" />
      </form>
    );
  }

  renderStartingLaneOptions() {
    return this.props.startingLanes.map((startingLane) => {
      const value = startingLane.StartingLaneId;
      const className = "startinglanes-generator-level" + startingLane.Level;
      const label = (<span className={className}>{startingLane.ShortName}</span>);
      return { value, label };
    });
  }

  renderDisciplineOptions() {
    return this.props.disciplines.map((discipline) => {
      const value = discipline.DisciplineId;
      const label = discipline.DisciplineId;
      return { value, label };
    })
  }
}

export default SettingsEditor;
