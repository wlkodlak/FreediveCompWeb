import React from 'react';
import { H5, HTMLTable, InputGroup, Button } from '@blueprintjs/core';

class AthleteAnnouncements extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDisciplineChanged = this.onDisciplineChanged.bind(this);
    this.state = {
      disciplines: this.props.disciplines.map((discipline, index) ->
        this.buildDisciplineState(this.props.announcements, discipline, index)
    };
  }

  buildDisciplineState(announcements, discipline, index) {
    const row = {
      id: discipline.DisciplineId,
      index: index,
      name: discipline.ShortName,
      placeholder: getPlaceholderByRules(discipline.Rules),
      dirty: false,
      valid: true,
      performance: discipline.Performance,
      formatted: findFormattedAnnouncement(
        announcements, discipline.DisciplineId,
        getPerformanceFormatter(discipline.Rules), ""),
      performanceParser: getPerformanceParser(discipline.Rules)
    };
    row.onChangeHandler = (event) -> this.onDisciplineChanged(row, event.target.value);
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
      if (announcement.DisciplineId == disciplineId) {
        return formatter(announcement);
      }
    }
    return fallback;
  }

  getPerformanceFormatter(rules) {
    switch (rules) {
      case "AIDA-STA":
      case "CMAS-STA":
        return formatDurationPerformance;
      case "AIDA-DYN":
      case "CMAS-DYN":
        return formatDistancePerformance;
      case "AIDA-CWT":
      case "CMAS-CWT":
        return formatDepthPerformance;
    }
  }

  formatDurationPerformance(performance) {
    if (typeof performance == "object" && typeof performance.Duration == "string") {
      return performance.Duration.substring(3);
    } else {
      return "";
    }
  }

  formatDistancePerformance(performance) {
    if (typeof performance == "object" && typeof performance.Distance == "number") {
      return performance.Distance.toString();
    } else {
      return "";
    }
  }

  formatDepthPerformance(performance) {
    if (typeof performance == "object" && typeof performance.Depth == "number") {
      return performance.Depth.toString();
    } else {
      return "";
    }
  }

  getPerformanceParser(rules) {
    switch (rules) {
      case "AIDA-STA":
      case "CMAS-STA":
        return parseDurationPerformance;
      case "AIDA-DYN":
      case "CMAS-DYN":
        return parseDistancePerformance;
      case "AIDA-CWT":
      case "CMAS-CWT":
        return parseDepthPerformance;
    }
  }

  parseDurationPerformance(value) {
    const colonPosition = value.indexOf(":");
    let minutes = 0;
    let seconds = 0;
    if (colonPosition < 0) {
      seconds = parseInt(value);
    } else {
      minutes = parseInt(value.substring(0, colonPosition));
      seconds = parseInt(value.substring(colonPosition + 1));
    }
    if (seconds >= 60) {
      minutes += seconds / 60;
      seconds = seconds % 60;
    }
    return {
      "Duration": "00:" + (minutes < 10 ? "0" : "") + minutes.toString() + ":" + (seconds < 10 ? "0" : "") + seconds.toString();
    };
  }

  parseDistancePerformance(value) {
    return {
      "Distance": parseInt(value)
    };
  }

  parseDepthPerformance(value) {
    return {
      "Depth": parseInt(value)
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
      .filter(discipline -> discipline.dirty)
      .map(discipline -> {
        "DisciplineId": discipline.id,
        "Performance": discipline.performanceParser(discipline.value)
      });
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
              this.state.disciplines.map(discipline -> (
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
