import React from 'react';
import { HTMLTable, InputGroup, FormGroup, Checkbox, HTMLSelect, Button } from '@blueprintjs/core';

class SetupRaceDisciplines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edited: this.buildEmptyDiscipline()
    };
    this.onToggleLock = this.onToggleLock.bind(this);
    this.onNewDiscipline = this.onNewDiscipline.bind(this);
    this.onEditDiscipline = this.onEditDiscipline.bind(this);
    this.onTrashDiscipline = this.onTrashDiscipline.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDisciplineIdChanged = this.onDisciplineIdChanged.bind(this);
    this.onShortNameChanged = this.onShortNameChanged.bind(this);
    this.onDisciplineIdChanged = this.onDisciplineIdChanged.bind(this);
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
      edited: this.buildEmptyDiscipline()
    });
  }

  onEditDiscipline(discipline) {
    this.setState({
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
    const disciplines = [];
    for (var existing of this.props.disciplines) {
      if (existing.DisciplineId === discipline.DisciplineId) {
        disciplines.push(this.state.edited);
      } else {
        disciplines.push(existing);
      }
    }
    this.props.onChange(disciplines);
    this.setState({
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

  onDisciplineIdChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        DisciplineId: value
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
        {this.renderEditForm()}
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
      <tr key={discipline.DisciplineId}>
        <td>(new)</td>
        <td>&nbsp;</td>
        <td>
          <Button type="button" icon="plus" onClick={this.onNewDiscipline} />
        </td>
      </tr>
    );
  }

  renderEditForm() {
    return (
      <form className="setuprace-disciplines-editform" onSubmit={this.onSubmit}>
        <FormGroup label="Id">
          <InputGroup value={this.edited.DisciplineId} onChange={this.onDisciplineIdChanged} />
        </FormGroup>
        <FormGroup label="Short name">
          <InputGroup value={this.edited.ShortName} onChange={this.onShortNameChanged} />
        </FormGroup>
        <FormGroup label="Long name">
          <InputGroup value={this.edited.LongName} onChange={this.onLongNameChanged} />
        </FormGroup>
        <FormGroup label="Rules">
          <HTMLSelect value={this.edited.Rules} options={rulesOptions} onChange={this.onRulesChanged} />
        </FormGroup>
        <FormGroup label="Locks">
          <Checkbox
            checked={this.edited.AnnouncementsClosed}
            onChange={this.onAnnouncementsClosedChanged}
            label="Announcements closed" />
          <Checkbox
            checked={this.edited.ResultsClosed}
            onChange={this.onResultsClosedChanged}
            label="Results closed" />
        </FormGroup>
        <Button type="submit" text="Apply changes" />
      </form>
    );
  }
}

export default SetupRaceDisciplines;
