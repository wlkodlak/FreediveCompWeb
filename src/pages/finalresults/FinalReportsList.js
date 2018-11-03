import React from 'react';
import { H1, UL } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

class FinalReportsList extends React.Component {
  render() {
    const raceId = this.props.raceId;
    const raceSetup = this.props.raceSetup;
    const resultsLists = raceSetup == null ? [] : raceSetup.ResultsLists;
    return (
      <div className="finalresults-list">
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
