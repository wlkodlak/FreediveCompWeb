import React from 'react';
import { H1, FormGroup, RadioGroup, Button, InputGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Redirect } from 'react-router-dom';
import CheckboxGroup from './CheckboxGroup';
import Api from '../../api/Api';
import GeneratorCore from './GeneratorCore';
import RaceHeader from '../homepage/RaceHeader';

class GeneratorTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startingLanes: [],
      disciplines: [],
      selectedStartingLane: null,
      selectedDisciplines: [],
      startInterval: 10,
      breakInterval: 180,
      breakDuration: 30,
      firstStart: null,
      generated: false
    }
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onAthletesLoaded = this.onAthletesLoaded.bind(this);
    this.onStartListCreated = this.onStartListCreated.bind(this);
    this.onStartingLaneChanged = this.onStartingLaneChanged.bind(this);
    this.onDisciplinesChanged = this.onDisciplinesChanged.bind(this);
    this.onStartIntervalChanged = this.onStartIntervalChanged.bind(this);
    this.onBreakDurationChanged = this.onBreakDurationChanged.bind(this);
    this.onFirstStartChanged = this.onFirstStartChanged.bind(this);
  }

  componentWillMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    const startingLanes = [];
    this.flattenStartingLanes(startingLanes, 0, raceSetup.StartingLanes);

    const disciplines = raceSetup.Disciplines.map(discipline => ({
        value: discipline.DisciplineId,
        label: discipline.LongName,
        rawDiscipline: discipline
      }));

    const firstStart = new Date(raceSetup.Race.Start);

    this.setState({ startingLanes, disciplines, firstStart });
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

  onFormSubmit(event) {
    event.preventDefault();
    Api.getAthletes(this.props.raceId).then(this.onAthletesLoaded);
  }

  onAthletesLoaded(athletes) {
    const raceId = this.props.raceId;
    const startingLaneId = this.state.selectedStartingLane;
    const generator = new GeneratorCore(
      this.state,
      this.state.startingLanes,
      athletes);
    const startingList = generator.buildStartListEntries();
    Api
      .postStartingList(raceId, startingLaneId, startingList)
      .then(this.onStartListCreated);
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
    let value = event.target.value;
    if (typeof value === "string") {
      value = parseInt(value, 10);
    } else if (typeof value !== "number") {
      return;
    }
    this.setState({
      startInterval: value
    });
  }

  onBreakIntervalChanged(event) {
    let value = event.target.value;
    if (typeof value === "string") {
      value = parseInt(value, 10);
    } else if (typeof value !== "number") {
      return;
    }
    this.setState({
      breakInterval: value
    });
  }

  onBreakDurationChanged(event) {
    let value = event.target.value;
    if (typeof value === "string") {
      value = parseInt(value, 10);
    } else if (typeof value !== "number") {
      return;
    }
    this.setState({
      breakDuration: value
    });
  }

  onFirstStartChanged(firstStart) {
    this.setState({ firstStart });
  }

  formatDate(now) {
    const year = ("0000" + now.getFullYear()).substr(-4);
    const month = ("00" + now.getMonth()).substr(-2);
    const day = ("00" + now.getDate()).substr(-2);
    const hours = ("00" + now.getHours()).substr(-2);
    const minutes = ("00" + now.getMinutes()).substr(-2);
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
  }

  parseDate(formatted) {
    return new Date(formatted);
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
    if (this.state.generated) {
      const raceId = this.props.raceId;
      const startingLaneId = this.state.selectedStartingLane;
      return (<Redirect push to={`${raceId}/startinglists/${startingLaneId}`} />);
    }
    return (
      <div>
        <RaceHeader raceId={this.props.raceId} />
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
              placeholder="180"
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
