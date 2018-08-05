import React from 'react';
import Api from '../../api/Api';
import { H1, HTMLTable } from '@blueprintjs/core';
import { formatPerformance } from '../finalresults/PerformanceFormatters';

class StartingList extends React.Component {
  constructor(props) {
    super(props);
    this.onStartingListReceived = this.onStartingListReceived.bind(this);
  }

  state = {
    title: "",
    entries: []
  }

  componentWillMount() {
    const { raceId, startingLaneId } = this.props;
    Api.getReportStartingList(raceId, startingLaneId).then(this.onStartingListReceived);
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
      officialTop: convertOfficialTop(entry.Start.OfficialTop),
      laneName: entry.Start.StartingLaneLongName,
      announced: formatPerformance(entry.Announcement.Performance),
      realized: entry.CurrentResult ? formatPerformance(entry.CurrentResult.Performance) : "",
      card: entry.CurrentResult ? convertShortCard(entry.CurrentResult.CardResult) : "",
      note: entry.CurrentResult ? entry.CurrentResult.JudgeNote : ""
    };
  }

  convertOfficialTop(xmlDateTime) {
    if (typeof xmlDateTime === "string" && xmlDateTime.length >= 19) {
      return xmlDateTime.substring(11, 19);
    } else {
      return "";
    }
  }

  convertPerformance(performance) {
    if (typeof performance.Distance === "number") {
      return `${performance.Distance}m`;
    } else if (typeof performance.Depth === "number") {
      return `${performance.Depth}m`;
    } else if (typeof performance.Duration === "string") {
      return performance.Duration.substring(3); // remove hours
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

  render() {
    return (
      <div>
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
