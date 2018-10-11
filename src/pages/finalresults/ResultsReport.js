import React from 'react';
import { H1, HTMLTable } from '@blueprintjs/core';

class ResultsReport extends React.Component {
  render() {
    const { title, columns, results, exportHtmlLink, exportCsvLink } = this.props;

    return (
      <div>
        <div className="finalresults-title">
          <H1>{title}</H1>
          <div className="finalresults-exports">
            Export to: <a href={exportHtmlLink}>HTML</a> | <a href={exportCsvLink}>CSV</a>
          </div>
        </div>
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
                        const subresult = result.Subresults[columnIndex];
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
