import React from 'react';
import { Link } from 'react-router-dom';
import { H3, UL } from '@blueprintjs/core';

class HomePage extends React.Component {
  state = {
    title: "Competition menu"
  }

  render() {
    const userType = this.props.userType;
    if (userType === "Anonymous") {
      return this.renderAnonymous();
    } else if (userType === "Judge") {
      return this.renderJudge();
    } else if (userType === "Admin") {
      return this.renderAdmin();
    } else {
      return null;
    }
  }

  renderAnonymous() {
    const raceId = this.props.raceId;
    return (
      <div className="homepage">
        <UL>
          <li><Link to={`/${raceId}/startinglists`}>Start lists</Link></li>
          <li><Link to={`/${raceId}/disciplines`}>Disciplines</Link></li>
          <li><Link to={`/${raceId}/resultlists`}>Results lists</Link></li>
          <li><Link to={`/${raceId}/athletes`}>Athletes</Link></li>
          <li><Link to={`/${raceId}/authenticate`}>Authenticate as judge</Link></li>
        </UL>
      </div>
    );
  }

  renderJudge() {
    const raceId = this.props.raceId;
    return (
      <div className="homepage">
        <UL>
          <li><Link to={`/${raceId}/startinglists`}>Start lists</Link></li>
          <li><Link to={`/${raceId}/disciplines`}>Disciplines</Link></li>
          <li><Link to={`/${raceId}/resultlists`}>Results lists</Link></li>
          <li><Link to={`/${raceId}/athletes`}>Athletes</Link></li>
        </UL>
      </div>
    );
  }

  renderAdmin() {
    const raceId = this.props.raceId;
    return (
      <div className="homepage">
        <H3>Progress</H3>
        <UL>
          <li><Link to={`/${raceId}/startinglists`}>Start lists</Link></li>
          <li><Link to={`/${raceId}/disciplines`}>Disciplines</Link></li>
          <li><Link to={`/${raceId}/resultlists`}>Results lists</Link></li>
        </UL>
        <H3>Setup</H3>
        <UL>
          <li><Link to={`/${raceId}/setup`}>Settings</Link></li>
          <li><Link to={`/${raceId}/judges`}>Judges</Link></li>
          <li><Link to={`/${raceId}/athletes`}>Athletes</Link></li>
          <li><Link to={`/${raceId}/startinglists/generator`}>Generate start list</Link></li>
        </UL>
      </div>
    );
  }
}

export default HomePage;
