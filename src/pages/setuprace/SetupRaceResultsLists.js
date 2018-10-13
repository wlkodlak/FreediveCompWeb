import React from 'react';
import { FormGroup, InputGroup, HTMLTable, HTMLSelect, Checkbox, Button } from '@blueprintjs/core';

class SetupRaceResultsLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderResultsListRow = this.renderResultsListRow.bind(this);
    this.onNewResultsList = this.onNewResultsList.bind(this);
    this.onEditResultsList = this.onEditResultsList.bind(this);
    this.onTrashResultsList = this.onTrashResultsList.bind(this);
  }

  onNewResultsList() {

  }

  onEditResultsList(resultsList) {
    
  }

  onTrashResultsList(resultsList) {
    const resultsLists = [];
    for (var existing of this.props.resultsLists) {
      if (existing.ResultsListId === resultsList.ResultsListId) continue;
      resultsLists.push(existing);
    }
    this.props.onChange(resultsLists);
  }

  render() {
    const resultsLists = this.props.resultsLists || [];
    return (
      <div className="setuprace-resultslists-container">
        <HTMLTable>
          <thead>{this.renderTableHeader()}</thead>
          <tbody>
            {disciplines.map(this.renderResultsListRow)}
            {this.renderNewResultsListRow()}
          </tbody>
        </HTMLTable>
        {this.renderEditForm()}
      </div>
    );
  }

  renderTableHeader() {
    return (
      <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Columns</th>
        <th>Actions</th>
      </tr>
    );
  }

  renderResultsListRow(resultsList) {
    const columnsSummary = resultsList.Columns.map(c => c.Title).join(", ");
    return (
      <tr key={resultsList.ResultsListId}>
        <td>{resultsList.ResultsListId}</td>
        <td>{resultsList.Title}</td>
        <td>{columnsSummary}</td>
        <td>
          <Button type="button" icon="edit" onClick={() => this.onEditResultsList(resultsList)} />
          <Button type="button" icon="trash" onClick={() => this.onTrashResultsList(resultsList)} />
        </td>
      </tr>
    );
  }

  renderNewDisciplineRow() {
    return (
      <tr key={discipline.DisciplineId}>
        <td>(new)</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>
          <Button type="button" icon="plus" onClick={this.onNewResultsList} />
        </td>
      </tr>
    );
  }

  renderEditForm() {
    return null;
  }
}

export default SetupRaceResultsLists;
