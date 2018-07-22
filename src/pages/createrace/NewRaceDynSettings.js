import React from 'react';
import { H5, FormGroup, NumericInput, HTMLSelect, Checkbox } from '@blueprintjs/core';

class NewRaceDynSettings extends React.Component {
  constructor(props) {
    super(props);
    this.onLanesChanged = this.onLanesChanged.bind(this);
    this.onRulesChanged = this.onRulesChanged.bind(this);
    this.onCategoriesChanged = this.onCategoriesChanged.bind(this);
    this.onEquipmentChanged = this.onEquipmentChanged.bind(this);
    this.onNoFinsChanged = this.onNoFinsChanged.bind(this);
    this.onBiFinsChanged = this.onBiFinsChanged.bind(this);
    this.onAnyFinsChanged = this.onAnyFinsChanged.bind(this);
  }

  static createSettings() {
    return {
      lanes: 2,
      rules: "AIDA-DYN",
      separateCategories: false,
      separateEquipment: false,
      disciplineNoFins: false,
      disciplineBiFins: false,
      disciplineAnyFins: true
    };
  }

  rulesOptions = [ "AIDA-DYN", "CMAS-DYN"];

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

  onEquipmentChanged(event) {
    this.props.onChange({
      ...this.props.value,
      separateEquipment: event.target.checked
    });
  }

  onNoFinsChanged(event) {
    this.props.onChange({
      ...this.props.value,
      disciplineNoFins: event.target.checked
    });
  }

  onBiFinsChanged(event) {
    this.props.onChange({
      ...this.props.value,
      disciplineBiFins: event.target.checked
    });
  }

  onAnyFinsChanged(event) {
    this.props.onChange({
      ...this.props.value,
      disciplineAnyFins: event.target.checked
    });
  }

  render() {
    const {
      lanes, rules,
      separateCategories, separateEquipment,
      disciplineNoFins, disciplineBiFins, disciplineAnyFins
    } = this.props.value;

    return (
      <div>
        <H5>DYN</H5>
        <FormGroup label="Lanes count">
          <NumericInput
            placeholder="Count" fill={true}
            value={lanes} onValueChange={this.onLanesChanged}
            majorStepSize={null} min={0} max={5} clampValueOnBlur={true} />
        </FormGroup>
        <FormGroup label="Rules">
          <HTMLSelect
            fill={true} options={this.rulesOptions}
            value={rules} onChange={this.onRulesChanged} />
        </FormGroup>
        <FormGroup label="Separate lanes for each ...">
          <Checkbox
            checked={separateCategories} onChange={this.onCategoriesChanged}
            label="athlete category" />
          <Checkbox
            checked={separateEquipment} onChange={this.onEquipmentChanged}
            label="kind of equipment" />
        </FormGroup>
        <FormGroup label="Separate disciplines for ...">
          <Checkbox
            checked={disciplineNoFins} onChange={this.onNoFinsChanged}
            label="no fins only" />
          <Checkbox
            checked={disciplineBiFins} onChange={this.onBiFinsChanged}
            label="bi-fins only" />
          <Checkbox
            checked={disciplineAnyFins} onChange={this.onAnyFinsChanged}
            label="with any fins" />
        </FormGroup>
      </div>
    );
  }
}

export default NewRaceDynSettings;
