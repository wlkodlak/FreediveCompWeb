import React from 'react';
import { FormGroup, InputGroup, H5 } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';

class NewRaceSettings extends React.Component {
  constructor(props) {
    super(props);
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onWhenChanged = this.onWhenChanged.bind(this);
  }

  static createSettings() {
    return {
      name: "",
      since: new Date(),
      until: new Date()
    };
  }

  onNameChanged(event) {
    this.props.onChange({
      ...this.props.value,
      name: event.target.value
    });
  }

  onWhenChanged(range) {
    this.props.onChange({
      ...this.props.value,
      since: range[0],
      until: range[1]
    });
  }

  formatDate(date) {
    if (date instanceof Date) {
      return date.toISOString().substring(0, 10);
    } else {
      return "";
    }
  }

  parseDate(str) {
    if (str == null) return null;
    return new Date(str);
  }

  render() {
    const settings = this.props.value;
    const name = settings.name;
    const since = settings.since == null ? null : settings.since;
    const until = settings.until == null ? null : settings.until;

    return (
      <div className="createrace-settings">
        <H5>Competition</H5>
        <FormGroup label="Name">
          <InputGroup
            value={name}
            onChange={this.onNameChanged}
            placeholder="Competition name" />
        </FormGroup>
        <FormGroup label="When">
          <DateRangeInput
            formatDate={this.formatDate}
            parseDate={this.parseDate}
            value={[since, until]}
            onChange={this.onWhenChanged}
            placeholder="YYYY-MM-DD"
            allowSingleDayRange={true}
            shortcuts={false}
            />
        </FormGroup>
      </div>
    );
  }
}

export default NewRaceSettings;
