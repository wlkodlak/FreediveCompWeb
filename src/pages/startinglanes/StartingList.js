import React from 'react';
import Api from '../../api/Api';
import { H1, HTMLTable } from '@blueprintjs/core';
import PerformanceComponent from '../../api/PerformanceComponent';
import moment from 'moment';
import { Link } from 'react-router-dom';

class StartingList extends React.Component {
  constructor(props) {
    super(props);
    this.onStartingListReceived = this.onStartingListReceived.bind(this);
    this.convertEntry = this.convertEntry.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  state = {
    title: "",
    entries: [],
    phone: false
  }

  componentDidMount() {
    const { raceId, startingLaneId } = this.props;
    Api.getReportStartingList(raceId, startingLaneId).then(this.onStartingListReceived).catch(this.props.onError);
    this.onWindowResize();
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
      announced: entry.Announcement ? PerformanceComponent.formatPerformance(entry.Announcement.Performance) : null,
      realized: entry.CurrentResult ? PerformanceComponent.formatPerformance(entry.CurrentResult.Performance) : "",
      card: entry.CurrentResult ? this.convertShortCard(entry.CurrentResult.CardResult) : "",
      note: entry.CurrentResult ? entry.CurrentResult.JudgeComment : "",
      link: `/${this.props.raceId}/enterresults/${entry.Start.StartingLaneId}/${entry.Athlete.AthleteId}/${entry.Discipline.DisciplineId}`
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

  buildExportLink(format, preset) {
    return Api.exportReportStartingList(this.props.raceId, this.props.startingLaneId, format, preset)
  }

  render() {
    return this.state.phone ? this.renderPhone() : this.renderDesktop();
  }

  renderDesktop() {
    const exportHtmlMinLink = this.buildExportLink("html", "minimal");
    const exportHtmlFullLink = this.buildExportLink("html", "running");
    const exportCsvLink = this.buildExportLink("csv", "running");
    return (
      <div className="startinglanes-startlist">
        <div className="startinglanes-listtitle">
          <H1>Starting List - {this.state.title}</H1>
          <div className="startinglanes-exports">
            Export to: <a href={exportHtmlMinLink}>Minimal HTML</a> | <a href={exportHtmlFullLink}>Full HTML</a> | <a href={exportCsvLink}>CSV</a>
          </div>
        </div>
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
              this.state.entries.map(entry => this.renderDesktopRow(entry))
            }
          </tbody>
        </HTMLTable>
      </div>
    );
  }

  isJudge() {
    return this.props.userType === "Judge" || this.props.userType === "Admin";
  }

  renderDesktopRow(entry) {
    return this.isJudge() ? this.renderDesktopRowForJudge(entry) : this.renderDesktopRowForAnonym(entry);
  }

  renderDesktopRowForAnonym(entry) {
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
  }

  renderDesktopRowForJudge(entry) {
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
  }

  renderPhone() {
    return (
      <div className="startinglanes-startlist">
        <H1>Starting List - {this.state.title}</H1>
        {
          this.state.entries.map(entry => this.renderPhoneEntry(entry))
        }
      </div>
    );
  }

  renderPhoneEntry(entry) {
    return this.isJudge() ? this.renderPhoneEntryForJudge(entry) : this.renderPhoneEntryForAnonym(entry);
  }

  renderPhoneEntryForAnonym(entry) {
    return (
      <div key={entry.number} className="startinglanes-startlist-miniitem">
        <div className="startinglanes-athlete">
          <span className="startinglanes-athlete-name">{entry.fullName}</span>
          <span className="startinglanes-country">{entry.country}</span>
        </div>
        <div className="startinglanes-extras">
          <span className="startinglanes-officialTop">OT {entry.officialTop}</span>
          <span className="startinglanes-announced">AP {entry.announced}</span>
        </div>
      </div>
    );
  }

  renderPhoneEntryForJudge(entry) {
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
  }
}

export default StartingList;
