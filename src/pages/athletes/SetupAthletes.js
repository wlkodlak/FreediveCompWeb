import React from 'react';
import { Link } from 'react-router-dom';
import { H1, HTMLTable } from '@blueprintjs/core';
import Api from '../../api/Api';
import RoutedButton from '../../components/RoutedButton';
import PerformanceComponent from '../../api/PerformanceComponent';

class SetupAthletes extends React.Component {
  constructor(props) {
    super(props);
    this.renderAthlete = this.renderAthlete.bind(this);
    this.onAthletesLoaded = this.onAthletesLoaded.bind(this);
  }

  state = {
    athletes: []
  }

  componentDidMount() {
    const raceId = this.props.raceId;
    Api.getAthletes(raceId).then(this.onAthletesLoaded).catch(this.props.onError);
  }

  onAthletesLoaded(athletes) {
    this.setState({athletes});
  }

  renderAthlete(dto) {
    const raceId = this.props.raceId;
    return {
      id: dto.Profile.AthleteId,
      link: `/${raceId}/athletes/${dto.Profile.AthleteId}`,
      fullName: `${dto.Profile.FirstName} ${dto.Profile.Surname}`,
      club: dto.Profile.Club,
      country: dto.Profile.CountryName,
      sex: dto.Profile.Sex,
      category: dto.Profile.Category,
      announcements: this.renderAnnouncements(dto.Announcements)
    };
  }

  renderAnnouncements(announcements) {
    if (announcements == null) return "";
    return announcements
      .map(a => a.DisciplineId + ": " + PerformanceComponent.formatPerformance(a.Performance))
      .join(", ");
  }

  render() {
    const raceId = this.props.raceId;
    const athletes = this.state.athletes.map(athlete => this.renderAthlete(athlete));

    return (<div className="athletes-list">
      <H1>Athletes</H1>
      <HTMLTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Club</th>
            <th>Country</th>
            <th>Sex</th>
            <th>Category</th>
            <th>Announcements</th>
          </tr>
        </thead>
        <tbody>
          {
            athletes.map(athlete => (
              <tr key={athlete.id}>
                <td><Link to={athlete.link}>{athlete.fullName}</Link></td>
                <td>{athlete.club}</td>
                <td>{athlete.country}</td>
                <td>{athlete.sex}</td>
                <td>{athlete.category}</td>
                <td>{athlete.announcements}</td>
              </tr>
            ))
          }
        </tbody>
      </HTMLTable>
      <RoutedButton to={`/${raceId}/athletes/new`} className="athletes-addbutton">Add athlete</RoutedButton>
    </div>);
  }
}

export default SetupAthletes;
