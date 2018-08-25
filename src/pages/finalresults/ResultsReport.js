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
              <th>Athlete</th>
              {
                columns.map((column, index) => column.renderHeader(index))
              }
            </tr>
          </thead>
          <tbody>
            {
              results.map((result, rowIndex) => {
                return (
                  <tr key={rowIndex}>
                    <td>{rowIndex + 1}</td>
                    <td>{`${result.Athlete.FirstName} ${result.Athlete.Surname}`}</td>
                    {
                      columns.map((column, columnIndex) => {
                        console.log("Rendering cell [" + rowIndex + ", " + columnIndex + "]");
                        const subresult = result.Subresults[columnIndex];
                        console.log(subresult);
                        return column.renderData(columnIndex, subresult);
                      })
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
