import React from 'react';
import { H1, UL, Toaster, Toast, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';
import RaceHeader from '../homepage/RaceHeader';

class FinalReportsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raceSetup: null,
      errors: []
    }
    this.onRaceSetupLoaded = this.onRaceSetupLoaded.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentWillMount() {
    Api.getRaceSetup(this.props.raceId).then(this.onRaceSetupLoaded).catch(this.onError);
  }

  onRaceSetupLoaded(raceSetup) {
    this.setState({raceSetup});
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
    const raceSetup = this.state.raceSetup;
    const resultsLists = raceSetup == null ? [] : raceSetup.ResultsLists;
    return (
      <div className="finalresults-list">
        <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
        <RaceHeader raceId={this.props.raceId} />
        <H1>Final results</H1>
        <UL>
          {
            resultsLists.map(resultsList => {
              const id = resultsList.ResultsListId;
              const name = resultsList.Title;
              return (
                <li key={id}>
                  <Link to={`/${raceId}/resultlists/${id}`}>{name}</Link>
                </li>
              );
            })
          }
        </UL>
      </div>
    );
  }
}

export default FinalReportsList;
