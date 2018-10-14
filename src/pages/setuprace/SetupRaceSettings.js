import React from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import { DateRangeInput } from '@blueprintjs/datetime';
import moment from 'moment';

class SetupRaceSettings extends React.Component {
  constructor(props) {
    super(props);
    const raceSettings = this.props.raceSettings;
    this.state = {
      name: this.extractName(raceSettings.Name),
      since: this.extractDate(raceSettings.Start),
      until: this.extractDate(raceSettings.End)
    };
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onWhenChanged = this.onWhenChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  extractName(name) {
    return typeof name === "string" ? name : "";
  }

  extractDate(date) {
    if (typeof date !== "string") return new Date();
    return moment(date).toDate();
  }

  buildDate(date, ending) {
    if (!date) return null;
    if (ending) {
      return moment(date).endOf("day").format();
    } else {
      return moment(date).startOf("day").format();
    }
  }

  onNameChanged(event) {
    this.setState({
      name: event.target.value
    })
  }

  onWhenChanged(range) {
    this.setState({
      since: range[0],
      until: range[1]
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onChange({
      ...this.props.raceSettings,
      "Name": this.state.name,
      "Start": this.buildDate(this.state.since, false),
      "End": this.buildDate(this.state.until, true)
    });
  }

  formatDate(date, locale) {
    return moment(date).format("YYYY-MM-DD");
  }

  parseDate(str) {
    return moment(str, "YYYY-MM-DD").toDate();
  }

  render() {
    const name = this.state.name;
    const since = this.state.since == null ? null : this.state.since;
    const until = this.state.until == null ? null : this.state.until;

    return (
      <form className="setuprace-settings" onSubmit={this.onSubmit}>
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
        <Button type="submit" text="Continue" />
      </form>
    );
  }
}

export default SetupRaceSettings;
