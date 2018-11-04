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
    this.onToggleAnnouncements = this.onToggleAnnouncements.bind(this);
    this.onToggleResults = this.onToggleResults.bind(this);
    this.onNewDiscipline = this.onNewDiscipline.bind(this);
    this.onEditDiscipline = this.onEditDiscipline.bind(this);
    this.onTrashDiscipline = this.onTrashDiscipline.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDisciplineIdChanged = this.onDisciplineIdChanged.bind(this);
    this.onShortNameChanged = this.onShortNameChanged.bind(this);
    this.onLongNameChanged = this.onLongNameChanged.bind(this);
    this.onRulesChanged = this.onRulesChanged.bind(this);
    this.onAnnouncementsClosedChanged = this.onAnnouncementsClosedChanged.bind(this);
    this.onAnnouncementsPublicChanged = this.onAnnouncementsPublicChanged.bind(this);
    this.onResultsClosedChanged = this.onResultsClosedChanged.bind(this);
    this.onResultsPublicChanged = this.onResultsPublicChanged.bind(this);
    this.renderDisciplineRow = this.renderDisciplineRow.bind(this);
  }

  buildEmptyDiscipline() {
    return {
      DisciplineId: "",
      ShortName: "",
      LongName: "",
      Rules: "",
      AnnouncementsClosed: false,
      ResultsClosed: false,
      AnnouncementsPublic: true,
      ResultsPublic: true
    };
  }

  onToggleAnnouncements(discipline) {
    const modified = {
      ...discipline
    };
    if (!modified.AnnouncementsPublic) {
      modified.AnnouncementsClosed = false;
      modified.AnnouncementsPublic = true;
    } else if (!modified.AnnouncementsClosed) {
      modified.AnnouncementsClosed = true;
      modified.AnnouncementsPublic = true;
    } else {
      modified.AnnouncementsClosed = false;
      modified.AnnouncementsPublic = false;
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

  onToggleResults(discipline) {
    const modified = {
      ...discipline
    };
    if (!modified.ResultsPublic) {
      modified.ResultsClosed = false;
      modified.ResultsPublic = true;
    } else if (!modified.ResultsClosed) {
      modified.ResultsClosed = true;
      modified.ResultsPublic = true;
    } else {
      modified.ResultsClosed = false;
      modified.ResultsPublic = false;
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

  onAnnouncementsPublicChanged(event) {
    const value = event.target.checked;
    this.setState({
      edited: {
        ...this.state.edited,
        AnnouncementsPublic: value
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

  onResultsPublicChanged(event) {
    const value = event.target.checked;
    this.setState({
      edited: {
        ...this.state.edited,
        ResultsPublic: value
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
    const announcementsIcon = !discipline.AnnouncementsPublic ? "disable" : !discipline.AnnouncementsClosed ? "unlock" : "lock";
    const resultsIcon = !discipline.ResultsPublic ? "disable" : !discipline.ResultsClosed ? "unlock" : "lock";
    return (
      <tr key={discipline.DisciplineId}>
        <td>{discipline.DisciplineId}</td>
        <td>{discipline.LongName}</td>
        <td>
          <Button type="button" icon={announcementsIcon} minimal={true} onClick={() => this.onToggleAnnouncements(discipline)} />
          <Button type="button" icon={resultsIcon} minimal={true} onClick={() => this.onToggleResults(discipline)} />
          <Button type="button" icon="edit" minimal={true} onClick={() => this.onEditDiscipline(discipline)} />
          <Button type="button" icon="trash" minimal={true} onClick={() => this.onTrashDiscipline(discipline)} />
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
          <Button type="button" icon="plus" minimal={true} onClick={this.onNewDiscipline} />
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
            checked={edited.AnnouncementsPublic}
            onChange={this.onAnnouncementsPublicChanged}
            label="Announcements visible to public" />
          <Checkbox
            checked={edited.ResultsClosed}
            onChange={this.onResultsClosedChanged}
            label="Results closed" />
          <Checkbox
            checked={edited.ResultsPublic}
            onChange={this.onResultsPublicChanged}
            label="Results visible to public" />
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
