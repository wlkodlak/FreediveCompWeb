import React from 'react';
import {Classes} from '@blueprintjs/core';
import {formatDurationPerformance, formatDistancePerformance, formatDepthPerformance} from '../finalresults/PerformanceFormatters';

class EnterResultComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onInputChanged = this.onInputChanged.bind(this);
  }

  getComponentName() {
    return this.props.component;
  }

  getFormatter() {
    const component = this.props.component;
    if (component === "Duration") {
      return formatDurationPerformance;
    } else if (component === "Distance") {
      return formatDistancePerformance;
    } else if (component === "Depth") {
      return formatDepthPerformance;
    } else {
      return this.formatUnknown;
    }
  }

  formatUnknown(performance) {
    return "";
  }

  getParser() {
    const component = this.props.component;
    if (component === "Duration") {
      return this.parseDurationPerformance;
    } else if (component === "Distance") {
      return this.parseDistancePerformance;
    } else if (component === "Depth") {
      return this.parseDepthPerformance;
    } else {
      return this.parseUnknown;
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

  parseUnknown(value) {
    return {};
  }

  getFormattedAnnouncement() {
    const formatter = this.getFormatter();
    return formatter(this.props.announced);
  }

  getFormattedRealized() {
    if (this.props.rawRealized != null) {
      return this.props.rawRealized;
    } else if (!this.props.realized) {
      return "";
    } else {
      const formatter = this.getFormatter();
      return formatter(this.props.realized);
    }
  }

  onInputChanged(event) {
    const inputValue = event.target.value;
    if (inputValue === "") {
      this.props.onChange("", null);
    } else {
      const parser = this.getParser();
      const parsedValue = inputValue === "" ? null : parser(inputValue);
      this.props.onChange(inputValue, parsedValue || this.props.realized);
    }
  }

  render() {
    return (
      <div className={Classes.FORM_GROUP}>
        <label className={Classes.LABEL + " enterresult-label-cell"} htmlFor="form-group-input">
          <span className="enterresult-label">{this.getComponentName()}</span>
          <span className="enterresult-announcement">AP {this.getFormattedAnnouncement()}</span>
        </label>
        <div className={Classes.FORM_CONTENT}>
          <div className={Classes.INPUT_GROUP}>
            <input type="text" className={Classes.INPUT} value={this.getFormattedRealized()} onChange={this.onInputChanged}/>
          </div>
        </div>
      </div>
    );
  }
}

export default EnterResultComponent;
