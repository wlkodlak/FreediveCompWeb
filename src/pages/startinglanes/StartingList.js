import React from 'react';
import Api from '../../api/Api';
import { H1, HTMLTable, Toaster, Toast, Intent } from '@blueprintjs/core';
import { formatPerformance } from '../finalresults/PerformanceFormatters';
import RaceHeader from '../homepage/RaceHeader';
import moment from 'moment';
import { Link } from 'react-router-dom';

class StartingList extends React.Component {
  constructor(props) {
    super(props);
    this.onStartingListReceived = this.onStartingListReceived.bind(this);
    this.convertEntry = this.convertEntry.bind(this);
    this.onError = this.onError.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  state = {
    title: "",
    entries: [],
    errors: [],
    phone: false
  }

  componentDidMount() {
    const { raceId, startingLaneId } = this.props;
    Api.getReportStartingList(raceId, startingLaneId).then(this.onStartingListReceived).catch(this.onError);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onStartingListReceived(report) {
    const title = report.Title;
    const entries = report.Entries.map(this.convertEntry);
    this.setState({title, entries});
  }

  onWindowResize() {
    const phone = window.innerWidth < 600;
    if (phone !== this.state.phone) {
      this.setState({phone: phone});
    }
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
      note: entry.CurrentResult ? entry.CurrentResult.JudgeNote : "",
      link: `/${raceId}/enterresults/${entry.Start.StartingLaneId}/${entry.Athlete.AthleteId}/${entry.Discipline.DisciplineId}`
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
    return this.state.isMobile > this.renderMobile() : this.renderDesktop();
  }

  renderDesktop() {
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
                    <td><Link to={entry.link}>{entry.fullName}</Link></td>
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

  renderPhone() {
    return (
      <div className="startinglanes-startlist">
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <RaceHeader raceId={this.props.raceId} page="startinglists" pageName="Starting lists" />
        <H1>Starting List - {this.state.title}</H1>
        {
          this.state.entries.map(entry => {
            return (
              <Link key={entry.number} to={entry.link} className="startinglanes-startlist-miniitem">
                <div className="startinglanes-athlete">
                  <span className="startinglanes-athlete-name">{entry.fullName}</span>
                  <span className="startinglanes-country">{entry.country}</span>
                </div>
                <div className="startinglanes-extras">
                  <span className="startinglanes-officialTop">OT {entry.officialTop}</span>
                  <span className="startinglanes-announced">AP {entry.announced}</span>
                </div>
              </Link>
            );
          })
        }
      </div>
    );
  }
}

export default StartingList;
