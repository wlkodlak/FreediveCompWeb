import React from 'react';
import { FormGroup, Checkbox } from '@blueprintjs/core';

class CheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    this.onCheckboxChanged = this.onCheckboxChanged.bind(this);
  }

  onCheckboxChanged(event) {
    const value = event.target.value;
    const checked = event.target.checked;
    const previouslySelected = this.props.selectedValues;
    const selectedValues = this.props.options
      .filter(option => option.value === value ? checked : previouslySelected.includes(option.value))
      .map(option => option.value);
    this.props.onChange({ value, checked, selectedValues });
  }

  render() {
    return (
      <FormGroup label={this.props.label}>
        { this.props.options.map(option => (
          <Checkbox
            key={option.value}
            checked={this.props.selectedValues.includes(option.value)}
            label={option.label}
            value={option.value}
            onChange={this.onCheckboxChanged} />
        ))}
      </FormGroup>
    );
  }
}

export default CheckboxGroup;
