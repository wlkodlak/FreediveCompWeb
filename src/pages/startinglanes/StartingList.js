import React from 'react';
import Api from '../../api/Api';
import { H1, HTMLTable, Toaster, Toast, Intent } from '@blueprintjs/core';
import { formatPerformance } from '../finalresults/PerformanceFormatters';
import RaceHeader from '../homepage/RaceHeader';
import moment from 'moment';

class StartingList extends React.Component {
  constructor(props) {
    super(props);
    this.onStartingListReceived = this.onStartingListReceived.bind(this);
    this.convertEntry = this.convertEntry.bind(this);
    this.onError = this.onError.bind(this);
  }

  state = {
    title: "",
    entries: [],
    errors: []
  }

  componentWillMount() {
    const { raceId, startingLaneId } = this.props;
    Api.getReportStartingList(raceId, startingLaneId).then(this.onStartingListReceived).catch(this.onError);
  }

  onStartingListReceived(report) {
    const title = report.Title;
    const entries = report.Entries.map(this.convertEntry);
    this.setState({title, entries});
  }

  convertEntry(entry, index) {
    return {
      number: index,
      fullName: `${entry.Athlete.FirstName} ${entry.Athlete.Surname}`,
      country: entry.Athlete.CountryName,
      officialTop: this.convertOfficialTop(entry.Start.OfficialTop),
      laneName: entry.Start.StartingLaneLongName,
      announced: formatPerformance(entry.Announcement.Performance),
      realized: entry.CurrentResult ? formatPerformance(entry.CurrentResult.Performance) : "",
      card: entry.CurrentResult ? this.convertShortCard(entry.CurrentResult.CardResult) : "",
      note: entry.CurrentResult ? entry.CurrentResult.JudgeNote : ""
    };
  }

  convertOfficialTop(xmlDateTime) {
    if (typeof xmlDateTime === "string" && xmlDateTime.length >= 19) {
      return moment(xmlDateTime).format("HH:mm");
    } else {
      return "";
    }
  }

  convertShortCard(card) {
    if (typeof card === "string" && card.length >= 1) {
      return card.substring(0, 1);
    } else {
      return "";
    }
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
      <div className="startinglanes-startlist">
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <RaceHeader raceId={this.props.raceId} page="startinglists" pageName="Starting lists" />
        <H1>Starting List - {this.state.title}</H1>
        <HTMLTable>
          <thead>
            <tr>
              <th>Athlete</th>
              <th>Country</th>
              <th>OT</th>
              <th>Lane</th>
              <th>Announced</th>
              <th colSpan="3">Realized</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.entries.map(entry => {
                return (
                  <tr key={entry.number}>
                    <td>{entry.fullName}</td>
                    <td>{entry.country}</td>
                    <td>{entry.officialTop}</td>
                    <td>{entry.laneName}</td>
                    <td>{entry.announced}</td>
                    <td>{entry.realized}</td>
                    <td>{entry.card}</td>
                    <td>{entry.note}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </HTMLTable>
      </div>
    );
  }
}

export default StartingList;
