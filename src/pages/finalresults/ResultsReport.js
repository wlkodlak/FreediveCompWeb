import React from 'react';
import { H1, HTMLTable } from '@blueprintjs/core';

class ResultsReport extends React.Component {
  render() {
    const { title, columns, results } = this.props;

    return (
      <div>
        <H1>{title}</H1>
        <HTMLTable>
          <thead>
            <tr>
              <th>#</th>
              <th colSpan="2">Athlete</th>
              {
                columns.map((column, index) => column.renderHeader(index))
              }
            </tr>
          </thead>
          <tbody>
            {
              results.map((result, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{`${result.Athlete.FirstName} ${result.Athlete.Surname}`}</td>
                    {
                      columns.map((column, index) => column.renderData(index, result))
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </HTMLTable>
      </div>
    );
  }
}

export default ResultsReport;
