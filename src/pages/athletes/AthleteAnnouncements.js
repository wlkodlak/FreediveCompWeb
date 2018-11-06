import React from 'react';
import { H5, HTMLTable, InputGroup, Button, Intent } from '@blueprintjs/core';
import PerformanceComponent from '../../api/PerformanceComponent';

class AthleteAnnouncements extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDisciplineChanged = this.onDisciplineChanged.bind(this);
    this.state = {
      changes: {}
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.announcements !== this.props.announcements) {
      this.setState({
        changes: {}
      });
    }
  }

  getComponentByRules(rules) {
    return PerformanceComponent.findPrimaryForDiscipline(rules, this.props.allRules);
  }

  findFormattedAnnouncement(announcements, disciplineId, component, fallback) {
    for (const announcement of announcements) {
      if (announcement.DisciplineId === disciplineId) {
        return component.format(announcement.Performance, false);
      }
    }
    return fallback;
  }

  onDisciplineChanged(discipline, newValue) {
    const component = this.getComponentByRules(discipline.Rules);
    const parsedValue = component.parse(newValue);
    const performance = component.buildPerformance(parsedValue);

    const changes = { ...this.state.changes };
    changes[discipline.DisciplineId] = {
      formatted: newValue,
      performance: performance
    };
    this.setState({changes});
  }

  onFormSubmit(event) {
    event.preventDefault();
    const announcements = [];
    for (const disciplineId in this.state.changes) {
      announcements.push({
        "DisciplineId": disciplineId,
        "Performance": this.state.changes[disciplineId].performance
      });
    }
    this.props.onSubmit(announcements);
  }

  render() {
    if (this.props.readonly) {
      return this.renderPublic();
    } else {
      return this.renderEditable();
    }
  }

  renderPublic() {
    return (
      <div className="athlete-announcements">
        <H5>Announcements</H5>
        <HTMLTable>
          <thead>
            <tr>
              <th>Discipline</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.disciplines.map(discipline => this.renderPublicAnnouncement(discipline))
            }
          </tbody>
        </HTMLTable>
      </div>
    );
  }

  renderPublicAnnouncement(discipline) {
    const component = this.getComponentByRules(discipline.Rules);
    const formattedValue = this.findFormattedAnnouncement(
      this.props.announcements, discipline.DisciplineId,
      component, "");

    return (
      <tr key={discipline.DisciplineId}>
        <td>{discipline.LongName}</td>
        <td>{formattedValue}</td>
      </tr>
    );
  }

  renderEditable() {
    const anyChange = typeof this.state.changes === "object" && Object.keys(this.state.changes).length > 0;
    return (
      <form onSubmit={this.onFormSubmit} className="athlete-announcements">
        <H5>Announcements</H5>
        <HTMLTable>
          <thead>
            <tr>
              <th>Discipline</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.disciplines.map(discipline => this.renderEditableAnnouncement(discipline))
            }
          </tbody>
        </HTMLTable>
        <Button type="submit" text="Save announcements" disabled={!anyChange} />
      </form>
    );
  }

  renderEditableAnnouncement(discipline) {
    let formattedValue = "";
    let isValueValid = false;
    const disciplineChange = this.state.changes[discipline.DisciplineId];
    const component = this.getComponentByRules(discipline.Rules);
    if (disciplineChange) {
      formattedValue = disciplineChange.formatted;
      isValueValid = formattedValue === "" || disciplineChange.performance != null;
    } else {
      formattedValue = this.findFormattedAnnouncement(
        this.props.announcements, discipline.DisciplineId,
        component, "");
      isValueValid = true;
    }
    const onChangeHandler = (event) => this.onDisciplineChanged(discipline, event.target.value);

    return (
      <tr key={discipline.DisciplineId}>
        <td>{discipline.LongName}</td>
        <td>
          <InputGroup
            type="text"
            placeholder={component.placeholder}
            value={formattedValue}
            intent={isValueValid ? Intent.NONE : Intent.WARNING}
            onChange={onChangeHandler} />
        </td>
      </tr>
    );
  }
}

export default AthleteAnnouncements;
