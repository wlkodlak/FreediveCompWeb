import React from 'react';
import { H1, UL } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Api from '../../api/Api';

class FinalReportsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      raceSetup: null
    }
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
    const resultsLists = raceSetup == null ? [] : raceSetup.ResultsLists;
    return (
      <div>
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
