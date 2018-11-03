import React from 'react';
import { H1, FormGroup, RadioGroup, Button, InputGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Redirect } from 'react-router-dom';
import CheckboxGroup from './CheckboxGroup';
import Api from '../../api/Api';
import GeneratorCore from './GeneratorCore';
import moment from 'moment';

class GeneratorTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startingLanes: this.getFlattenedStartingLanes(props),
      disciplines: this.getDisciplineInfos(props),
      selectedStartingLane: null,
      selectedDisciplines: [],
      startInterval: "10",
      breakInterval: "180",
      breakDuration: "30",
      firstStart: this.getInitialFirstStart(props),
      generated: false
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onAthletesLoaded = this.onAthletesLoaded.bind(this);
    this.onStartListCreated = this.onStartListCreated.bind(this);
    this.onStartingLaneChanged = this.onStartingLaneChanged.bind(this);
    this.onDisciplinesChanged = this.onDisciplinesChanged.bind(this);
    this.onStartIntervalChanged = this.onStartIntervalChanged.bind(this);
    this.onBreakIntervalChanged = this.onBreakIntervalChanged.bind(this);
    this.onBreakDurationChanged = this.onBreakDurationChanged.bind(this);
    this.onFirstStartChanged = this.onFirstStartChanged.bind(this);
  }

  getFlattenedStartingLanes(props) {
    const startingLanes = [];
    this.flattenStartingLanes(startingLanes, 0, props.raceSetup.StartingLanes);
    return startingLanes;
  }

  flattenStartingLanes(outputLanes, level, inputLanes) {
    if (inputLanes == null) return;
    for (const lane of inputLanes) {
      const label = lane.ShortName;
      outputLanes.push({
        value: lane.StartingLaneId,
        label: label,
        level: level,
        rawLane: lane
      });
      if (lane.SubLanes) {
        this.flattenStartingLanes(outputLanes, level + 1, lane.SubLanes);
      }
    }
  }

  getDisciplineInfos(props) {
    return props.raceSetup.Disciplines.map(discipline => ({
        value: discipline.DisciplineId,
        label: discipline.LongName,
        rawDiscipline: discipline
      }));
  }

  getInitialFirstStart(props) {
    return new Date(props.raceSetup.Race.Start);
  }

  onFormSubmit(event) {
    event.preventDefault();
    Api.getAthletes(this.props.raceId).then(this.onAthletesLoaded).catch(this.props.onError);
  }

  onAthletesLoaded(athletes) {
    try {
      const raceId = this.props.raceId;
      const startingLaneId = this.state.selectedStartingLane;
      const settings = this.buildSettings();
      const generator = new GeneratorCore(
        settings,
        this.state.startingLanes,
        athletes);
      const startingList = generator.buildStartListEntries();
      Api
        .postStartingList(raceId, startingLaneId, startingList)
        .then(this.onStartListCreated)
        .catch(this.props.onError);
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

  onStartListCreated() {
    this.setState({ generated: true });
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

  buildOption(fullOption) {
    const finalOption = {
      label: fullOption.label,
      value: fullOption.value
    };
    if (fullOption.level > 0) {
      finalOption.className = "startinglanes-generator-level" + fullOption.level;
    }
    return finalOption;
  }

  render() {
    const raceId = this.props.raceId;
    if (this.props.userType !== "Admin") {
      return (<Redirect to={`/${raceId}/homepage`} />);
    }
    if (this.state.generated) {
      const startingLaneId = this.state.selectedStartingLane;
      return (<Redirect push to={`/${raceId}/startinglists/${startingLaneId}`} />);
    }
    return (
      <div>
        <H1>Generate start list</H1>
        <form onSubmit={this.onFormSubmit}>
          <RadioGroup
            className="startinglanes-generator-lanes"
            label="Starting lane"
            onChange={this.onStartingLaneChanged}
            selectedValue={this.state.selectedStartingLane}
            options={this.state.startingLanes.map(this.buildOption)}
          />
          <CheckboxGroup
            label="Disciplines"
            onChange={this.onDisciplinesChanged}
            selectedValues={this.state.selectedDisciplines}
            options={this.state.disciplines.map(this.buildOption)}
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
      </div>
    );
  }
}

export default GeneratorTool;
