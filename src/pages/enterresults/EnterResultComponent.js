import React from 'react';
import {Classes} from '@blueprintjs/core';

class EnterResultComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onInputChanged = this.onInputChanged.bind(this);
  }

  getComponentName() {
    return this.props.component.name;
  }

  getFormattedAnnouncement() {
    const component = this.props.component;
    return component.format(this.props.announced, true);
  }

  getFormattedRealized() {
    if (this.props.rawRealized != null) {
      return this.props.rawRealized;
    } else if (!this.props.realized) {
      return "";
    } else {
      const component = this.props.component;
      return component.format(this.props.realized, false);
    }
  }

  onInputChanged(event) {
    const inputValue = event.target.value;
    if (inputValue === "") {
      this.props.onChange("", null);
    } else {
      const component = this.props.component;
      const parsedValue = component.parse(inputValue);
      const performance = component.buildPerformance(parsedValue);
      this.props.onChange(inputValue, performance || this.props.realized);
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
