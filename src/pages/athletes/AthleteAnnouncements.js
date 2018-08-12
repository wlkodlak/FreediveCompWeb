import React from 'react';
import { H5, HTMLTable, InputGroup, Button, Intent } from '@blueprintjs/core';

class AthleteAnnouncements extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDisciplineChanged = this.onDisciplineChanged.bind(this);
    this.state = {
      changes: {}
    };
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
        return formatter(announcement.Performance);
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
    if (performance != null && typeof performance === "object" && typeof performance.Duration === "string") {
      return performance.Duration.substring(3);
    } else {
      return "";
    }
  }

  formatDistancePerformance(performance) {
    if (performance != null && typeof performance === "object" && typeof performance.Distance === "number") {
      return performance.Distance.toString();
    } else {
      return "";
    }
  }

  formatDepthPerformance(performance) {
    if (performance != null && typeof performance === "object" && typeof performance.Depth === "number") {
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
    const checker = /^([0-9]+:)?([0-9]+)$/;
    if (!checker.test(value)) return null;

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
    const checker = /^[0-9]+$/;
    if (!checker.test(value)) return null;

    return {
      "Distance": parseInt(value, 10)
    };
  }

  parseDepthPerformance(value) {
    const checker = /^[0-9]+$/;
    if (!checker.test(value)) return null;

    return {
      "Depth": parseInt(value, 10)
    };
  }

  onDisciplineChanged(discipline, newValue) {
    const performanceParser = this.getPerformanceParser(discipline.Rules);
    const performance = performanceParser(newValue);

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
              this.props.disciplines.map(discipline => {
                let formattedValue = "";
                let isValueValid = false;
                const disciplineChange = this.state.changes[discipline.DisciplineId];
                if (disciplineChange) {
                  formattedValue = disciplineChange.formatted;
                  isValueValid = disciplineChange.performance != null;
                } else {
                  formattedValue = this.findFormattedAnnouncement(
                    this.props.announcements, discipline.DisciplineId,
                    this.getPerformanceFormatter(discipline.Rules), "");
                  isValueValid = true;
                }
                const onChangeHandler = (event) => this.onDisciplineChanged(discipline, event.target.value);

                return (
                  <tr key={discipline.DisciplineId}>
                    <td>{discipline.LongName}</td>
                    <td>
                      <InputGroup
                        type="text"
                        placeholder={this.getPlaceholderByRules(discipline.Rules)}
                        value={formattedValue}
                        intent={isValueValid ? Intent.NONE : Intent.WARNING}
                        onChange={onChangeHandler} />
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </HTMLTable>
        <Button type="submit" text="Save announcements" />
      </form>
    );
  }
}

export default AthleteAnnouncements;
