import React from 'react';
import { Link } from 'react-router-dom';
import { H1, H2, UL } from '@blueprintjs/core';
import Api from '../../api/Api';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
  }

  state = {
    title: "Competition menu"
  }

  componentWillMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({title: raceSetup.Race.Name});
  }

  render() {
    const raceId = this.props.raceId;
    const title = this.state.title;
    return (
      <div>
        <H1>{title}</H1>
        <H2>Competition progress</H2>
        <UL>
          <li><Link to={`/${raceId}/startinglists`}>Start lists</Link></li>
          <li><Link to={`/${raceId}/disciplines`}>Discipines</Link></li>
          <li><Link to={`/${raceId}/resultlists`}>Results lists</Link></li>
          <li><Link to={`/${raceId}/startinglists/generator`}>Generate start list</Link></li>
        </UL>
        <H2>Competition setup</H2>
        <UL>
          <li><Link to={`/${raceId}/judges`}>Judges</Link></li>
          <li><Link to={`/${raceId}/athletes`}>Athletes</Link></li>
        </UL>
      </div>
    );
  }
}

export default HomePage;
