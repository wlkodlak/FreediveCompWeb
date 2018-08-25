import React from 'react';
import { H1, UL } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';
import RaceHeader from '../homepage/RaceHeader';

class DisciplinesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raceSetup: null
    };
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
  }

  componentWillMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({raceSetup});
  }

  render() {
    const raceId = this.props.raceId;
    const raceSetup = this.state.raceSetup;
    const disciplines = raceSetup == null ? [] : raceSetup.Disciplines;
    return (
      <div className="disciplines-list">
        <RaceHeader raceId={this.props.raceId} />
        <H1>Disciplines</H1>
        <UL>
          {
            disciplines.map(discipline => {
              const id = discipline.DisciplineId;
              const name = discipline.LongName;
              return (
                <li key={id}>
                  <Link to={`/${raceId}/disciplines/${id}`}>{name}</Link>
                </li>
              );
            })
          }
        </UL>
      </div>
    );
  }
}

export default DisciplinesList;
