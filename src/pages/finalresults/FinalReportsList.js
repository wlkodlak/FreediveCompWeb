import React from 'react';
import { H1 } from '@blueprintjs/core';
import Api from '../../api/Api';

class FinalReportsList extends React.Component {
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
        <H1>Final results</H1>
        <UL>
          {
            this.state.ResultsLists.map(resultsList => {
              const id = resultsList.ResultsListId;
              const name = resultsList.Title;
              return (
                <li key={id}>
                  <Link to={`${raceId}/resultlists/${id}`}>{name}</Link>
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
