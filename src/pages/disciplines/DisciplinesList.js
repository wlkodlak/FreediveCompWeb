import React from 'react';
import { H1, UL } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';

class DisciplinesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raceSetup: null,
      errors: []
    };
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
  }

  componentDidMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.props.onError);
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
