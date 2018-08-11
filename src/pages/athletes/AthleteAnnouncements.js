import React from 'react';
import { H5, HTMLTable, InputGroup, Button, Intent } from '@blueprintjs/core';

class AthleteAnnouncements extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDisciplineChanged = this.onDisciplineChanged.bind(this);
    this.state = {
      disciplines: this.props.disciplines.map((discipline, index) =>
        this.buildDisciplineState(this.props.announcements, discipline, index))
    };
  }

  buildDisciplineState(announcements, discipline, index) {
    const row = {
      id: discipline.DisciplineId,
      index: index,
      name: discipline.ShortName,
      placeholder: this.getPlaceholderByRules(discipline.Rules),
      dirty: false,
      valid: true,
      performance: discipline.Performance,
      formatted: this.findFormattedAnnouncement(
        announcements, discipline.DisciplineId,
        this.getPerformanceFormatter(discipline.Rules), ""),
      performanceParser: this.getPerformanceParser(discipline.Rules)
    };
    row.onChangeHandler = (event) => this.onDisciplineChanged(row, event.target.value);
    return row;
  }

  getPlaceholderByRules(rules) {
    switch (rules) {
      case "AIDA-STA":
      case "CMAS-STA":
        return "mm:ss";
      case "AIDA-DYN":
      case "CMAS-DYN":
        return "100";
      case "AIDA-CWT":
      case "CMAS-CWT":
        return "50";
      default:
        return "";
    }
  }

  findFormattedAnnouncement(announcements, disciplineId, formatter, fallback) {
    for (const announcement of announcements) {
      if (announcement.DisciplineId === disciplineId) {
        return formatter(announcement);
      }
    }
    return fallback;
  }

  getPerformanceFormatter(rules) {
    switch (rules) {
      case "AIDA-STA":
      case "CMAS-STA":
        return this.formatDurationPerformance;
      case "AIDA-DYN":
      case "CMAS-DYN":
        return this.formatDistancePerformance;
      case "AIDA-CWT":
      case "CMAS-CWT":
        return this.formatDepthPerformance;
      default:
        return (performance) => "";
    }
  }

  formatDurationPerformance(performance) {
    if (typeof performance === "object" && typeof performance.Duration === "string") {
      return performance.Duration.substring(3);
    } else {
      return "";
    }
  }

  formatDistancePerformance(performance) {
    if (typeof performance === "object" && typeof performance.Distance === "number") {
      return performance.Distance.toString();
    } else {
      return "";
    }
  }

  formatDepthPerformance(performance) {
    if (typeof performance === "object" && typeof performance.Depth === "number") {
      return performance.Depth.toString();
    } else {
      return "";
    }
  }

  getPerformanceParser(rules) {
    switch (rules) {
      case "AIDA-STA":
      case "CMAS-STA":
        return this.parseDurationPerformance;
      case "AIDA-DYN":
      case "CMAS-DYN":
        return this.parseDistancePerformance;
      case "AIDA-CWT":
      case "CMAS-CWT":
        return this.parseDepthPerformance;
      default:
        return s => null;
    }
  }

  parseDurationPerformance(value) {
    const colonPosition = value.indexOf(":");
    let minutes = 0;
    let seconds = 0;
    if (colonPosition < 0) {
      seconds = parseInt(value, 10);
    } else {
      minutes = parseInt(value.substring(0, colonPosition), 10);
      seconds = parseInt(value.substring(colonPosition + 1), 10);
    }
    if (seconds >= 60) {
      minutes += seconds / 60;
      seconds = seconds % 60;
    }
    const formattedDuration =
      "00:" +
      (minutes < 10 ? "0" : "") + minutes.toString() + ":" +
      (seconds < 10 ? "0" : "") + seconds.toString();
    return {
      "Duration": formattedDuration
    };
  }

  parseDistancePerformance(value) {
    return {
      "Distance": parseInt(value, 10)
    };
  }

  parseDepthPerformance(value) {
    return {
      "Depth": parseInt(value, 10)
    };
  }

  onDisciplineChanged(oldDiscipline, newValue) {
    const disciplines = this.state.disciplines.slice(0);
    const performance = oldDiscipline.performanceParser(newValue);
    const formatted = newValue;
    const valid = performance != null;
    disciplines[oldDiscipline.index] = {
      ...oldDiscipline,
      formatted: formatted,
      valid: valid,
      dirty: true
    };
    this.setState({disciplines});
  }

  onFormSubmit(event) {
    event.preventDefault();
    const announcements = this.state.disciplines
      .filter(discipline => discipline.dirty)
      .map(discipline => ({
        "DisciplineId": discipline.id,
        "Performance": discipline.performanceParser(discipline.value)
      }));
    this.props.onSubmit(announcements);
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
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
              this.state.disciplines.map(discipline => (
                <tr key={discipline.id}>
                  <td>{discipline.name}</td>
                  <td>
                    <InputGroup
                      type="text"
                      placeholder={discipline.placeholder}
                      value={discipline.formatted}
                      intent={discipline.valid ? Intent.NONE : Intent.WARNING}
                      onChange={discipline.onChangeHandler} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </HTMLTable>
        <Button type="submit" text="Save announcements" />
      </form>
    );
  }
}

export default AthleteAnnouncements;
