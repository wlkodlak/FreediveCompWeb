import React from 'react';
import { H2, Toaster, Toast, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';

class RaceHeader extends React.Component {
  constructor(props) {
    super(props);
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      raceName: "Competition",
      errors: []
    };
  }

  componentDidMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.onError);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({
      raceName: raceSetup.Race.Name
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
    const raceName = this.state.raceName;
    const groupPath = this.props.page;
    const groupName = this.props.pageName;
    return (
      <div>
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <H2>
          <Link to={`/${raceId}/homepage`} className="headerLink">{raceName}</Link>
          { groupPath && " - "}
          { groupPath && <Link to={`/${raceId}/${groupPath}`} className="headerLink">{groupName}</Link> }
        </H2>
      </div>
    );
  }
}

export default RaceHeader;
