import React from 'react';
import { Link } from 'react-router-dom';
import { H1, HTMLTable } from '@blueprintjs/core';
import Api from '../../api/Api';

class SetupAthletes extends React.Component {
  constructor(props) {
    super(props);
    this.renderAthlete = this.renderAthlete.bind(this);
    this.onAthletesLoaded = this.onAthletesLoaded.bind(this);
  }

  state = {
    athletes: []
  }

  componentWillMount() {
    const raceId = this.props.raceId;
    Api.getAthletes(raceId).then(this.onAthletesLoaded);
  }

  onAthletesLoaded(athletes) {
    this.setState({athletes});
  }

  renderAthlete(dto) {
    const raceId = this.props.raceId;
    return {
      id: dto.Profile.AthleteId,
      link: `/${raceId}/athletes/${athlete.Profile.AthleteId}`
      fullName: `${athlete.Profile.FirstName} ${athlete.Profile.Surname}`,
      club: dto.Profile.Club,
      country: dto.Profile.Country,
      sex: dto.Profile.Sex,
      category: dto.Profile.Category,
    };
  }

  render() {
    const raceId = this.props.raceId;
    const athletes = this.state.athletes.map(athlete -> this.renderAthlete(athlete));

    return (<div>
      <H1>Athletes</H1>
      <HTMLTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Club</th>
            <th>Country</th>
            <th>Sex</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {
            athletes.map(athlete -> (
              <tr key={athlete.id}>
                <td><Link to={athlete.link}>{athlete.fullName}</Link></td>
                <td>{athlete.club}</td>
                <td>{athlete.country}</td>
                <td>{athlete.sex}</td>
                <td>{athlete.category}</td>
              </tr>
            ))
          }
        </tbody>
      </HTMLTable>
      <Link to={`/${raceId}/athletes/new`}>Add athlete</Link>
    </div>);
  }
}

export default SetupAthletes;