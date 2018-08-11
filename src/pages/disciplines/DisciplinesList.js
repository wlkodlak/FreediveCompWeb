import React from 'react';
import { H1, UL } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';

class DisciplinesList extends React.Component {
  state = {
    raceSetup: null
  }

  componentWillMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({raceSetup});
  }

  render() {
    const raceId = this.props.raceId;
    return (
      <div>
        <H1>Disciplines</H1>
        <UL>
          {
            this.state.Disciplines.map(discipline => {
              const id = discipline.DisciplineId;
              const name = discipline.ShortName;
              return (
                <li key={id}>
                  <Link to={`${raceId}/disciplines/${id}`}>{name}</Link>
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
