import React from 'react';
import { H5, HTMLTable } from '@blueprintjs/core';
import { formatPerformance } from '../finalresults/PerformanceFormatters';

class AthleteResults extends React.Component {
  render() {
    const results = this.props.results;
    if (results.length === 0) {
      return (
        <div className="athlete-results">
          <H5>No results</H5>
        </div>
      );
    } else {
      return (
        <div className="athlete-results">
          <H5>Results</H5>
          <HTMLTable>
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Performance</th>
                <th>Judge</th>
                <th>Card</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {
                results.map((result, index) => this.renderResult(result, index))
              }
            </tbody>
          </HTMLTable>
        </div>
      );
    }
  }

  renderResult(result, index) {
    const disciplineName = this.findDisciplineName(result.DisciplineId);
    const formattedPerformance = formatPerformance(result.Performance);
    const judgeName = this.findJudgeName(result.JudgeId);
    const formattedCard = this.formatCard(result.CardResult);
    const notes = result.JudgeComment;

    return (
      <tr key={index}>
        <td>{disciplineName}</td>
        <td>{formattedPerformance}</td>
        <td>{judgeName}</td>
        <td>{formattedCard}</td>
        <td>{notes}</td>
      </tr>
    );
  }

  findDisciplineName(disciplineId) {
    return disciplineId;
  }

  findJudgeName(judgeId) {
    return judgeId;
  }

  formatCard(card) {
    return card.toLowerCase();
  }
}

export default AthleteResults;
