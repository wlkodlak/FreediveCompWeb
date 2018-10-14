import React from 'react';
import { HTMLTable, InputGroup, FormGroup, Checkbox, HTMLSelect, Button } from '@blueprintjs/core';

class SetupRaceDisciplines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorEnabled: false,
      editedId: null,
      edited: this.buildEmptyDiscipline()
    };
    this.onToggleLock = this.onToggleLock.bind(this);
    this.onNewDiscipline = this.onNewDiscipline.bind(this);
    this.onEditDiscipline = this.onEditDiscipline.bind(this);
    this.onTrashDiscipline = this.onTrashDiscipline.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDisciplineIdChanged = this.onDisciplineIdChanged.bind(this);
    this.onShortNameChanged = this.onShortNameChanged.bind(this);
    this.onLongNameChanged = this.onLongNameChanged.bind(this);
    this.onRulesChanged = this.onRulesChanged.bind(this);
    this.onAnnouncementsClosedChanged = this.onAnnouncementsClosedChanged.bind(this);
    this.onResultsClosedChanged = this.onResultsClosedChanged.bind(this);
  }

  buildEmptyDiscipline() {
    return {
      DisciplineId: "",
      ShortName: "",
      LongName: "",
      Rules: "",
      AnnouncementsClosed: false,
      ResultsClosed: false
    };
  }

  onToggleLock(discipline) {
    const modified = {
      ...discipline
    };
    if (modified.ResultsClosed) {
      modified.ResultsClosed = false;
      modified.AnnouncementsClosed = false;
    } else if (modified.AnnouncementsClosed) {
      modified.ResultsClosed = true;
      modified.AnnouncementsClosed = true;
    } else {
      modified.ResultsClosed = false;
      modified.AnnouncementsClosed = true;
    }

    const disciplines = [];
    for (var existing of this.props.disciplines) {
      if (existing.DisciplineId === discipline.DisciplineId) {
        disciplines.push(modified);
      } else {
        disciplines.push(existing);
      }
    }
    this.props.onChange(disciplines);
  }

  onNewDiscipline() {
    this.setState({
      editorEnabled: true,
      editedId: null,
      edited: this.buildEmptyDiscipline()
    });
  }

  onEditDiscipline(discipline) {
    this.setState({
      editorEnabled: true,
      editedId: discipline.DisciplineId,
      edited: {
        ...discipline
      }
    });
  }

  onTrashDiscipline(discipline) {
    const disciplines = [];
    for (var existing of this.props.disciplines) {
      if (existing.DisciplineId === discipline.DisciplineId) continue;
      disciplines.push(existing);
    }
    this.props.onChange(disciplines);
  }

  onSubmit(event) {
    event.preventDefault();
    let isNew = this.state.editedId == null;
    const edited = this.state.edited;

    if (!edited.DisciplineId || !edited.ShortName || !edited.LongName) return;

    const disciplines = [];
    for (var existing of this.props.disciplines) {
      if (existing.DisciplineId === edited.DisciplineId) {
        disciplines.push(edited);
        isNew = false;
      } else {
        disciplines.push(existing);
      }
    }
    if (isNew) disciplines.push(edited);

    this.props.onChange(disciplines);
    this.setState({
      editorEnabled: false,
      editedId: null,
      edited: this.buildEmptyDiscipline()
    });
  }

  onDisciplineIdChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        DisciplineId: value
      }
    });
  }

  onShortNameChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        ShortName: value
      }
    });
  }

  onLongNameChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        LongName: value
      }
    });
  }

  onRulesChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        Rules: value
      }
    });
  }

  onAnnouncementsClosedChanged(event) {
    const value = event.target.checked;
    this.setState({
      edited: {
        ...this.state.edited,
        AnnouncementsClosed: value
      }
    });
  }

  onResultsClosedChanged(event) {
    const value = event.target.checked;
    this.setState({
      edited: {
        ...this.state.edited,
        ResultsClosed: value
      }
    });
  }

  render() {
    const disciplines = this.props.disciplines || [];
    return (
      <div className="setuprace-disciplines-container">
        <HTMLTable>
          <thead>{this.renderTableHeader()}</thead>
          <tbody>
            {disciplines.map(this.renderDisciplineRow)}
            {this.renderNewDisciplineRow()}
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
        <th>Long name</th>
        <th>Actions</th>
      </tr>
    );
  }

  renderDisciplineRow(discipline) {
    const lockIcon = discipline.ResultsClosed ? "disable" : discipline.AnnouncementsClosed ? "lock" : "unlock";
    return (
      <tr key={discipline.DisciplineId}>
        <td>{discipline.DisciplineId}</td>
        <td>{discipline.LongName}</td>
        <td>
          <Button type="button" icon={lockIcon} onClick={() => this.onToggleLock(discipline)} />
          <Button type="button" icon="edit" onClick={() => this.onEditDiscipline(discipline)} />
          <Button type="button" icon="trash" onClick={() => this.onTrashDiscipline(discipline)} />
        </td>
      </tr>
    );
  }

  renderNewDisciplineRow() {
    return (
      <tr key="new">
        <td>(new)</td>
        <td>&nbsp;</td>
        <td>
          <Button type="button" icon="plus" onClick={this.onNewDiscipline} />
        </td>
      </tr>
    );
  }

  renderEditForm() {
    const edited = this.state.edited;
    const isNew = this.state.editedId === null;
    return (
      <form className="setuprace-disciplines-editform" onSubmit={this.onSubmit}>
        <FormGroup label="Id">
          <InputGroup
            value={edited.DisciplineId}
            onChange={this.onDisciplineIdChanged}
            disabled={!isNew}/>
        </FormGroup>
        <FormGroup label="Short name">
          <InputGroup value={edited.ShortName} onChange={this.onShortNameChanged} />
        </FormGroup>
        <FormGroup label="Long name">
          <InputGroup value={edited.LongName} onChange={this.onLongNameChanged} />
        </FormGroup>
        <FormGroup label="Rules">
          <HTMLSelect value={edited.Rules} options={this.buildRulesOptions()} onChange={this.onRulesChanged} />
        </FormGroup>
        <FormGroup label="Locks">
          <Checkbox
            checked={edited.AnnouncementsClosed}
            onChange={this.onAnnouncementsClosedChanged}
            label="Announcements closed" />
          <Checkbox
            checked={edited.ResultsClosed}
            onChange={this.onResultsClosedChanged}
            label="Results closed" />
        </FormGroup>
        <Button type="submit" text="Apply changes" />
      </form>
    );
  }

  buildRulesOptions() {
    // TODO: use rules from backend
    return [
      "AIDA_STA",
      "AIDA_DYN",
      "AIDA_CWT"
    ];
  }
}

export default SetupRaceDisciplines;
