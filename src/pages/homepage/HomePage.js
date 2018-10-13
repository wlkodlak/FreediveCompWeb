import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { H1, H2, UL, Toaster, Toast, Intent } from '@blueprintjs/core';
import Api from '../../api/Api';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onUserVerified = this.onUserVerified.bind(this);
    this.onUserUnauthenticated = this.onUserUnauthenticated.bind(this);
    this.onError = this.onError.bind(this);
  }

  state = {
    title: "Competition menu",
    userType: null,
    errors: []
  }

  componentDidMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.onError);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      title: raceSetup.Race.Name
    });
    Api.getAuthVerify(this.props.raceId).then(this.onUserVerified).catch(this.onUserUnauthenticated);
  }

  onUserVerified(judge) {
    this.setState({
      userType: judge.IsAdmin ? "Admin" : "Judge"
    });
  }

  onUserUnauthenticated() {
    this.setState({
      userType: "Anonymous"
    });
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
    const raceId = this.props.raceId;
    const title = this.state.title;
    const userType = this.state.userType;
    if (userType === "Anonymous") {
      return (<Redirect to={`/${raceId}/authenticate`} />);
    } else if (userType === "Judge") {
      return (<Redirect to={`/${raceId}/startinglists`} />);
    } else if (userType === "Admin") {
      return (
        <div className="homepage">
          <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
          <H1>{title}</H1>
          <H2>Competition progress</H2>
          <UL>
            <li><Link to={`/${raceId}/startinglists`}>Start lists</Link></li>
            <li><Link to={`/${raceId}/disciplines`}>Disciplines</Link></li>
            <li><Link to={`/${raceId}/resultlists`}>Results lists</Link></li>
            <li><Link to={`/${raceId}/startinglists/generator`}>Generate start list</Link></li>
          </UL>
          <H2>Competition setup</H2>
          <UL>
            <li><Link to={`/${raceId}/setup`}>Settings</Link></li>
            <li><Link to={`/${raceId}/judges`}>Judges</Link></li>
            <li><Link to={`/${raceId}/athletes`}>Athletes</Link></li>
          </UL>
        </div>
      );
    } else {
      return (
        <div className="homepage">
          <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
          <H1>{title}</H1>
        </div>
      );
    }
  }
}

export default HomePage;
