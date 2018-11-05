import React from 'react';
import { H1 } from '@blueprintjs/core';
import { Redirect } from 'react-router-dom';
import Api from '../../api/Api';
import AssignmentsEditor from './AssignmentsEditor';
import AthleteStartExtractor from './AthleteStartExtractor';
import SettingsEditor from './SettingsEditor';
import StartingLanesFlattener from './StartingLanesFlattener';
import StartSlotGenerator from './StartSlotGenerator';

export default class GeneratestartingList {
  constructor(props) {
    super(props);
    this.state = {
      settings: null,
      startingList: null,
      confirmed: false
    };
    this.onSettingsConfirmed = this.onSettingsConfirmed.bind(this);
  }

  getStartingLanes() {
    const flattener = new StartingLanesFlattener();
    return flattener.getFlattenedStartingLanes(this.props.raceSetup.StartingLanes);
  }

  getDisciplines() {
    return this.props.raceSetup.Disciplines;
  }

  onSettingsConfirmed(settings) {
    Api
      .getAthletes(this.props.raceId)
      .then((athletes) => this.onReadyForGenerating(settings, athletes))
  }

  onReadyForGenerating(settings, athletes) {
    const extractor = new AthleteStartExtractor();

    const athleteStartsParts = [];
    for (const discipline of this.getDisciplines()) {
      if (settings.selectedDisciplines.includes(discipline.DisciplineId)) {
        athleteStartsParts.push(extractor.getStartsForDiscipline(discipline, athletes));
      }
    }
    const athleteStarts = extractor.mergeStarts(athleteStartsParts);
    extractor.sortStarts(athleteStarts);

    const slotGenerator = new StartSlotGenerator(settings, this.getStartingLanes());
    const startingList = [];
    for (const start of athleteStarts) {
      const slot = slotGenerator.generate();
      slot.AssignedAthleteStart = start;
      startingList.push(slot);
    }

    this.setState({
      settings: settings,
      startingList: startingList,
      slotGenerator: slotGenerator
    });
  }

  onAssignmentSwap(fromPosition, toPosition) {
    const startingList = this.state.startingList.slice(0);
    const fromSlot = startingList[fromPosition];
    const toSlot = startingList[toPosition];
    startingList[fromPosition] = { ...fromSlot, AssignedAthleteStart: toSlot.AssignedAthleteStart };
    startingList[toPosition] = { ...toSlot, AssignedAthleteStart: fromSlot.AssignedAthleteStart };
    this.setState({ startingList: startingList });
  }

  onStartingListConfirmed() {
    const raceId = this.props.raceId;
    const startingLaneId = this.state.settings.selectedStartingLane;
    const startingList = this.state.startingList;
    Api
      .postStartingList(raceId, startingLaneId, startingList)
      .then(this.onStartingListCreated)
      .catch(this.props.onError);
  }

  onStartingListCreated() {
    this.setState({
      confirmed: true
    });
  }

  render() {
    if (this.props.userType !== "Admin") {
      return (<Redirect to={`/${raceId}/homepage`} />);
    } else if (!this.state.settings) {
      return this.renderSettings();
    } else if (this.state.confirmed) {
      const startingLaneId = this.state.settings.selectedStartingLane;
      return (<Redirect push to={`/${raceId}/startinglists/${startingLaneId}`} />);
    } else {
      return this.renderAssignments();
    }
  }

  renderSettings() {
    return (
      <div>
        <H1>Generate start list</H1>
        <SettingsEditor
          startingLanes={this.getStartingLanes()}
          disciplines={this.getDisciplines()}
          onError={this.props.onError}
          onSettingsConfirmed={this.onSettingsConfirmed}
        />
      </div>
    );
  }

  renderAssignments() {
    return (
      <div>
        <H1>Generate start list</H1>
        <AssignmentsEditor
          startingList={this.state.startingList}
          onSwap={this.onAssignmentSwap}
          onConfirm={this.onStartingListConfirmed}
        />
      </div>
    );
  }
}
