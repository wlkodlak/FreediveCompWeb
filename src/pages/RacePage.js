import React from 'react';
import Api from '../api/Api';
import { Link } from 'react-router-dom';
import { H2, Toaster, Toast, Intent } from '@blueprintjs/core';

export default class RacePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.buildInitialState();
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onUserVerified = this.onUserVerified.bind(this);
    this.onUserUnauthenticated = this.onUserUnauthenticated.bind(this);
    this.onError = this.onError.bind(this);
    this.onRaceInvalidated = this.onRaceInvalidated.bind(this);
  }

  componentWillMount() {
    Api.getAuthVerify(this.props.raceId).then(this.onUserVerified).catch(this.onUserUnauthenticated);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.raceId !== this.props.raceId) {
      this.setState((state) => {
        Api.getAuthVerify(this.props.raceId).then(this.onUserVerified).catch(this.onUserUnauthenticated);
        return this.buildInitialState();
      });
    }
  }

  onUserVerified(judge) {
    this.setState({
      userType: judge.IsAdmin ? "Admin" : "Judge",
      userTypeValid: true
    });
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.onError);
  }

  onUserUnauthenticated() {
    this.setState({
      userType: "Anonymous",
      userTypeValid: true
    });
    Api.saveExplicitToken(null, null);
    Api.saveExplicitToken(this.props.raceId, null);
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.onError);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      raceSetup: raceSetup,
      raceSetupValid: true
    });
  }

  buildInitialState() {
    return {
      raceSetup: null,
      userType: null,
      raceSetupValid: false,
      userTypeValid: false,
      errors: []
    };
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

  onRaceInvalidated() {
    this.setState((state) => {
      Api.getAuthVerify(this.props.raceId).then(this.onUserVerified).catch(this.onUserUnauthenticated);
      return this.buildInitialState();
    });
  }

  render() {
    if (!this.state.raceSetupValid || !this.state.userTypeValid) {
      return (
        <div>
          {this.renderToaster()}
        </div>
      );
    } else {
      return (
        <div>
          {this.renderToaster()}
          {this.renderHeader()}
          {this.renderTargetComponent()}
        </div>
      );
    }
  }

  renderToaster() {
    const toasts = this.state.errors.map((error, index) => this.renderToast(error, index));
    return (<Toaster>{toasts}</Toaster>);
  }

  renderToast(error, index) {
    return (<Toast key={index} intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />);
  }

  renderHeader() {
    const { raceId, superPath, superName } = this.props;
    const raceSetup = this.state.raceSetup;
    const raceName = raceSetup.Race.Name;
    const HX = this.props.headerElement || H2;

    return (
      <HX>
        <Link to={`/${raceId}/homepage`} className="headerLink">{raceName}</Link>
        { superPath && " - "}
        { superPath && <Link to={`/${raceId}/${superPath}`} className="headerLink">{superName}</Link> }
      </HX>
    );
  }

  renderTargetComponent() {
    const { raceId, superPath, superName, component, ...params } = this.props;
    return React.createElement(
      component, {
        raceId: raceId,
        onError: this.onError,
        onRaceInvalidated: this.onRaceInvalidated,
        raceSetup: this.state.raceSetup,
        userType: this.state.userType,
        ...params
      });
  }
}
