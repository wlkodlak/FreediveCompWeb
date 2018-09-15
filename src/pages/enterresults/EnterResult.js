import React from 'react';
import Api from '../../api/Api';
import RaceHeader from '../homepage/RaceHeader';
import {H1, Toaster, Toast, Intent} from '@blueprintjs/core';
import EnterResultHeader from './EnterResultHeader.js';
import EnterResultComponent from './EnterResultComponent.js';
import EnterResultCard from './EnterResultCard.js';
import EnterResultPenalties from './EnterResultPenalties.js';
import EnterResultFooter from './EnterResultFooter.js';

class EnterResult extends React.Component {
  constructor(props) {
    super(props);
    const emptyState = {
      entryIndex: -1,
      startList: [],
      allRules: [],
      modified: false,
      entry: null,
      result: null,
      rules: null,
      errors: []
    };
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    Api.getGlobalRules().then(this.onRulesLoaded).catch(this.onError);
    Api.getReportStartingList(this.props.raceId, this.props.startingLaneId).then(this.onStartListLoaded).catch(
      this.onError
    );
  }

  componentWillReceiveProps(nextProps) {
    const sameStartList = nextProps.raceId === this.props.raceId && nextProps.startingLaneId === this.props.startingLaneId;
    const sameEntry = nextProps.athleteId === this.props.athleteId && nextProps.disciplineId === this.props.disciplineId;
    if (!sameStartList) {
      Api.getReportStartingList(this.props.raceId, this.props.startingLaneId).then(this.onStartListLoaded).catch(
        this.onError
      );
    } else if (!sameEntry) {
      const changes = {
        entry: null,
        result: null,
        modified: false,
        entryIndex: -1
      };
      this.setState((oldState, props) => this.changeState(oldState, props, changes));
    }
  }

  onRulesLoaded(rules) {
    const changes = {
      allRules: rules,
      rules: null
    };
    this.setState((oldState, props) => this.changeState(oldState, props, changes));
  }

  onStartListLoaded(startList) {
    const changes = {
      startList: startList,
      entry: null,
      result: null,
      modified: false,
      entryIndex: -1
    };
    this.setState((oldState, props) => this.changeState(oldState, props, changes));
  }

  onPrimaryComponentChanged(value) {
    const result = {
      ...this.state.result
    };
    result.Performance = {
      ...result.Performance
    };
    if (this.state.rules.PrimaryComponent === "Duration") {
      result.Performance.Duration = value;
    } else if (this.state.rules.PrimaryComponent === "Distance") {
      result.Performance.Distance = value;
    } else if (this.state.rules.PrimaryComponent === "Depth") {
      result.Performance.Depth = value;
    }
    this.recalculateResult(result, true);
    this.setState({modified: true, result: result});
  }

  onCardSelected(card) {
    const result = {
      ...this.state.result
    };
    result.CardResult = card;
    this.recalculateResult(result, false);
    this.setState({modified: true, result: result});
  }

  onAddPenalty(penalty) {
    const result = {
      ...this.state.result
    };
    result.Penalizations = result.Penalizations.slice(0);
    result.Penalizations.add(penalty);
    this.recalculateResult(result, false);
    this.setState({modified: true, result: result});
  }

  onRemovePenalty(index) {
    const result = {
      ...this.state.result
    };
    result.Penalizations = result.Penalizations.slice(0);
    result.Penalizations.splice(index, 1);
    this.recalculateResult(result, false);
    this.setState({modified: true, result: result});
  }

  onError(error) {
    const errors = this.state.errors.slice(0);
    errors.push(error.message);
    this.setState({errors: errors});
  }

  onErrorDismissed(index) {
    const errors = this.state.errors.slice(0);
    errors.splice(index, 1);
    this.setState({errors: errors});
  }

  changeState(original, props, changes) {
    const state = {
      ...state,
      ...changes
    };
    if (state.entryIndex < 0) {
      state.entryIndex = findEditingEntry(state.startList, props.athleteId, props.disciplineId);
    }
    if (state.entryIndex < 0 || !state.startList) {
      state.entry = null;
    } else {
      state.entry = state.startList[state.entryIndex];
    }
    if (!state.result && state.entry) {
      state.result = state.entry.CurrentResult || {};
    }
    return state;
  }

  findEditingEntry(startList, athleteId, disciplineId) {
    if (!startList) {
      return -1;
    }
    for (let i = 0; i < startList.length; i++) {
      const entry = startList[i];
      if (entry.Athlete.AthleteId === athleteId && entry.Discipline.DisciplineId === disciplineId) {
        return i;
      }
    }
    return -1;
  }

  findRules(allRules, ruleName) {
    if (!allRules || !ruleName) {
      return null;
    }
    for (const rule of allRules) {
      if (rule.Name === ruleName) {
        return rule;
      }
    }
    return null;
  }

  recalculateResult(result, needsShortPenalty) {}

  buildLink(position) {
    const startList = this.state.startList;
    if (!startList || position < 0 || position >= startList.length) {
      return null;
    }
    const entry = startList[position];
    const raceId = this.props.raceId;
    const startingLaneId = this.props.startingLaneId;
    const athleteId = entry.Athlete.AthleteId;
    const disciplineId = entry.Discipline.DisciplineId;
    return `/${raceId}/enterresults/${startingLaneId}/${athleteId}/${disciplineId}`;
  }

  render() {
    const raceId = this.props.raceId;
    const entryIndex = this.state.entryIndex;
    const entry = this.state.entry;
    const rules = this.state.rules;
    const result = this.state.result;
    const status = this.state.status;
    const errors = this.state.errors;

    if (entry == null || rules == null || result == null) {
      return (
        <div className="enterresults-form">
          <Toaster>{
              errors.map(
                (error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)}/>
              )
            }</Toaster>
          <RaceHeader raceId={raceId} page="athletes" pageName="Athletes"/>
          <H1>Enter performance</H1>
        </div>
      );

    } else {
      const previousLink = this.buildLink(entryIndex - 1);
      const nextLink = this.buildLink(entryIndex + 1);

      return (
        <form className="enterresults-form" onSubmit={this.onFormSubmit}>
          <Toaster>{
              errors.map(
                (error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)}/>
              )
            }</Toaster>
          <RaceHeader raceId={raceId} page="athletes" pageName="Athletes"/>
          <H1>Enter performance</H1>
          <EnterResultHeader raceId={raceId} start={entry}/>
          <EnterResultComponent
            raceId={raceId}
            announced={entry.Announcement.Performance}
            realized={result.Performance}
            component={rules.PrimaryComponent}
            onChange={this.onPrimaryComponentChanged}/>
          <EnterResultCard raceId={raceId} result={result} onCardSelected={this.onCardSelected}/>
          <EnterResultPenalties
            raceId={raceId}
            result={result}
            rules={rules}
            onAddPenalty={this.onAddPenalty}
            onRemovePenalty={this.onRemovePenalty}/>
          <EnterResultFooter raceId={raceId} result={result} modified={modified} previousLink={previousLink} nextLink={nextLink}/>
        </form>
      );
    }
  }
}

export default EnterResult;
