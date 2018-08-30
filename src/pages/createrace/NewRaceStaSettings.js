import React from 'react';
import { H5, FormGroup, NumericInput, HTMLSelect, Checkbox } from '@blueprintjs/core';

class NewRaceStaSettings extends React.Component {
  constructor(props) {
    super(props);
    this.onLanesChanged = this.onLanesChanged.bind(this);
    this.onRulesChanged = this.onRulesChanged.bind(this);
    this.onCategoriesChanged = this.onCategoriesChanged.bind(this);
  }

  static createSettings() {
    return {
      lanes: 4,
      rules: "AIDA_STA",
      separateCategories: false
    };
  }

  rulesOptions = [ "AIDA_STA", "CMAS_STA"];

  onLanesChanged(lanes) {
    this.props.onChange({
      ...this.props.value,
      lanes
    });
  }

  onRulesChanged(event) {
    this.props.onChange({
      ...this.props.value,
      rules: event.target.value
    });
  }

  onCategoriesChanged(event) {
    this.props.onChange({
      ...this.props.value,
      separateCategories: event.target.checked
    });
  }

  render() {
    const { lanes, rules, separateCategories } = this.props.value;

    return (
      <div className="createrace-discipline">
        <H5>STA</H5>
        <FormGroup label="Lanes count">
          <NumericInput
            placeholder="Count" fill={true}
            value={lanes} onValueChange={this.onLanesChanged}
            majorStepSize={null} min={0} max={10} clampValueOnBlur={true} />
        </FormGroup>
        <FormGroup label="Rules">
          <HTMLSelect
            fill={true} options={this.rulesOptions}
            value={rules} onChange={this.onRulesChanged} />
        </FormGroup>
        <Checkbox
          checked={separateCategories} onChange={this.onCategoriesChanged}
          label="Separate lanes for each athlete category" />
      </div>
    );
  }
}

export default NewRaceStaSettings;
