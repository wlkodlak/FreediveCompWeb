import React from 'react';
import { FormGroup, InputGroup, HTMLTable, HTMLSelect, Checkbox, Button, ButtonGroup, NumericInput } from '@blueprintjs/core';

class SetupRaceResultsLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorEnabled: false,
      editedId: null,
      edited: this.buildEmptyResultsList()
    };
    this.renderResultsListRow = this.renderResultsListRow.bind(this);
    this.onNewResultsList = this.onNewResultsList.bind(this);
    this.onEditResultsList = this.onEditResultsList.bind(this);
    this.onTrashResultsList = this.onTrashResultsList.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onResultsListIdChanged = this.onResultsListIdChanged.bind(this);
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.renderEditColumn = this.renderEditColumn.bind(this);
    this.onAddColumn = this.onAddColumn.bind(this);
  }

  buildEmptyResultsList() {
    return {
      ResultsListId: "",
      Title: "",
      Columns: []
    };
  }

  onNewResultsList() {
    this.setState({
      editorEnabled: true,
      editedId: null,
      edited: this.buildEmptyResultsList()
    });
  }

  onEditResultsList(resultsList) {
    this.setState({
      editorEnabled: true,
      editedId: resultsList.ResultsListId,
      edited: resultsList
    });
  }

  onTrashResultsList(resultsList) {
    const resultsLists = [];
    for (var existing of this.props.resultsLists) {
      if (existing.ResultsListId === resultsList.ResultsListId) continue;
      resultsLists.push(existing);
    }
    this.props.onChange(resultsLists);
  }

  onSubmit(event) {
    event.preventDefault();
    let isNew = this.state.editedId == null;
    const edited = this.cleanupEdited(this.state.edited);
    if (!edited) return;

    const resultsLists = [];
    for (var existing of this.props.resultsLists) {
      if (existing.ResultsListId === edited.ResultsListId) {
        resultsLists.push(edited);
        isNew = false;
      } else {
        resultsLists.push(existing);
      }
    }
    if (isNew) resultsLists.push(edited);

    this.props.onChange(resultsLists);
    this.setState({
      editorEnabled: false,
      editedId: null,
      edited: this.buildEmptyResultsList()
    });
  }

  cleanupEdited(edited) {
    if (!edited.ResultsListId || edited.Title) return null;
    const fixed = {
      ...edited
    };
    fixed.Columns = fixed
      .Columns
      .map(c => this.cleanupColumn(c))
      .filter(c => !!c);
    if (fixed.Columns.length === 0) return null;
    return fixed;
  }

  cleanupColumn(column) {
    if (!column.Title) return null;
    const fixed = {
      ...column
    };
    fixed.Components = fixed
      .Components
      .map(c => this.cleanupComponent(c))
      .filter(c => !!c);
    if (fixed.Components.length === 0) return null;
    return fixed;
  }

  cleanupComponent(component) {
    if (!component.DisciplineId) return null;
    if (component.DisciplineId === "-") return null;
    if (!this.disciplineExists(component.DisciplineId)) return null;
    return component;
  }

  disciplineExists(disciplineId) {
    const disciplines = this.props.disciplines;
    if (!disciplines) return false;
    for (const discipline of disciplines) {
      if (discipline.DisciplineId === disciplineId) return true;
    }
    return false;
  }

  onResultsListIdChanged(event) {
    this.setState({
      edited: {
        ...this.state.edited,
        ResultsListId: event.target.value
      }
    });
  }

  onTitleChanged(event) {
    this.setState({
      edited: {
        ...this.state.edited,
        Title: event.target.value
      }
    });
  }

  onAddColumn() {
    const edited = { ...this.state.edited };
    edited.Columns = edited.Columns.slice(0);
    edited.Columns.push({
      Title: "",
      IsFinal: false,
      Components: []
    });
    this.setState({
      edited: edited
    });
  }

  onColumnTrash(columnIndex) {
    const edited = { ...this.state.edited };
    edited.Columns = edited.Columns.slice(0);
    edited.Columns.splice(columnIndex, 1);
    this.setState({
      edited: edited
    });
  }

  changeColumn(columnIndex, updater) {
    const edited = { ...this.state.edited };
    edited.Columns = edited.Columns.slice(0);
    let column = edited.Columns[columnIndex];
    column = { ...column };
    updater(column);
    edited.Columns[columnIndex] = column;
    this.setState({
      edited: edited
    });
  }

  onColumnTitleChanged(columnIndex, event) {
    this.changeColumn(columnIndex, column => column.Title = event.target.value);
  }

  onColumnIsFinalChanged(columnIndex, event) {
    this.changeColumn(columnIndex, column => column.IsFinal = event.target.checked);
  }

  onComponentDisciplineChanged(columnIndex, componentIndex, event) {
    const value = event.target.value;
    const columnUpdater = column => this.changeComponentDiscipline(column, componentIndex, value);
    this.changeColumn(columnIndex, columnUpdater);
  }

  onComponentCoeficientChanged(columnIndex, componentIndex, numberValue, stringValue) {
    const columnUpdater = column => this.changeComponentCoeficient(column, componentIndex, numberValue);
    this.changeColumn(columnIndex, columnUpdater);
  }

  changeComponentDiscipline(column, componentIndex, disciplineId) {
    column.Components = column.Components.slice(0);
    if (column.Components.length < componentIndex) {
      column.Components[componentIndex] = {
        ...column.Components[componentIndex],
        DisciplineId: disciplineId
      };
    } else {
      column.Components.push({
        DisciplineId: disciplineId,
        FinalPointsCoeficient: null
      });
    }
  }

  changeComponentCoeficient(column, componentIndex, coeficient) {
    column.Components = column.Components.slice(0);
    if (column.Components.length < componentIndex) {
      column.Components[componentIndex] = {
        ...column.Components[componentIndex],
        FinalPointsCoeficient: coeficient
      };
    } else {
      column.Components.push({
        DisciplineId: "-",
        FinalPointsCoeficient: coeficient
      });
    }
  }

  render() {
    const resultsLists = this.props.resultsLists || [];
    return (
      <div className="setuprace-resultslists-container">
        <HTMLTable>
          <thead>{this.renderTableHeader()}</thead>
          <tbody>
            {resultsLists.map(this.renderResultsListRow)}
            {this.renderNewResultsListRow()}
          </tbody>
        </HTMLTable>
        {this.state.editorEnabled && this.renderEditForm()}
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

  renderNewResultsListRow() {
    return (
      <tr key="new">
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
    const isNew = !this.state.editedId;
    const edited = this.state.edited;
    return (
      <form className="setuprace-resulstslists-form" onSubmit={this.onSubmit}>
        <h5>Common</h5>
        <FormGroup label="Id">
          <InputGroup
            value={edited.ResultsListId}
            onChange={this.onResultsListIdChanged}
            disabled={!isNew} />
        </FormGroup>
        <FormGroup label="Title">
          <InputGroup value={edited.Title} onChange={this.onTitleChanged} />
        </FormGroup>
        {edited.Columns.map(this.renderEditColumn)}
        <ButtonGroup>
          <Button text="Add column" type="button" onClick={this.onAddColumn} />
          <Button text="Apply changes" type="submit" />
        </ButtonGroup>
      </form>
    );
  }

  renderEditColumn(column, columnIndex) {
    const components = column.Components.slice(0);
    if (!components.some(c => c.DisciplineId === "-")) {
      components.push({
        DisciplineId: "-",
        FinalPointsCoeficient: 1.0
      });
    }
    return (
      <div className="setuprace-resultslists-column" key={columnIndex}>
        <div className="setuprace-resultslists-columntitle">
          <h5>Column #{columnIndex}</h5>
          <Button icon="trash" onClick={() => this.onColumnTrash(columnIndex)} />
        </div>
        <FormGroup label="Title">
          <InputGroup
            value={column.Title}
            onChange={(event) => this.onColumnTitleChanged(columnIndex, event)} />
        </FormGroup>
        <Checkbox
          checked={column.IsFinal}
          label="Primary sorting"
          onChange={(event) => this.onColumnIsFinalChanged(columnIndex, event)} />
        <table>
          <tr>
            <th>Discipline</th>
            <th>Coeficient</th>
          </tr>
          {components.map((component, index) => this.renderEditComponent(columnIndex, component, index))}
        </table>
      </div>
    );
  }

  renderEditComponent(columnIndex, component, componentIndex) {
    return (
      <tr key={componentIndex}>
        <td>
          <HTMLSelect
            value={component.DisciplineId}
            options={this.buildDisciplinesOptions()}
            onChange={(event) => this.onComponentDisciplineChanged(columnIndex, componentIndex, event)} />
        </td>
        <td>
          <NumericInput
            value={component.FinalPointsCoeficient}
            min={0}
            max={100}
            majorStepSize={0.1}
            minorStepSize={0.01}
            onChange={(n, s) => this.onComponentCoeficientChanged(columnIndex, componentIndex, n, s)} />
        </td>
      </tr>
    );
  }

  buildDisciplinesOptions() {
    const options = [];
    options.push({
      label: "(Select discipline)",
      value: "-"
    });
    for (const discipline of this.props.disciplines) {
      options.push({
        label: discipline.DisciplineId,
        value: discipline.DisciplineId
      });
    }
    return options;
  }
}

export default SetupRaceResultsLists;
