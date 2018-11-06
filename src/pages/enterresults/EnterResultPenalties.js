import React from 'react';
import Api from '../../api/Api';
import {FormGroup, InputGroup, HTMLSelect, Button, Tag, Classes} from '@blueprintjs/core';
import PerformanceComponent from '../../api/PerformanceComponent';

class EnterResultPenalties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedReason: "Unselected",
      customReason: "",
      amount: "1"
    };
    this.onReasonChanged = this.onReasonChanged.bind(this);
    this.onCustomReasonChanged = this.onCustomReasonChanged.bind(this);
    this.onAmountChanged = this.onAmountChanged.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onPenalizationCalculated = this.onPenalizationCalculated.bind(this);
    this.onError = this.onError.bind(this);
  }

  onReasonChanged(event) {
    const selectedReason = event.target.value;
    this.setState({selectedReason});
  }

  onCustomReasonChanged(event) {
    const customReason = event.target.value;
    this.setState({customReason});
  }

  onAmountChanged(event) {
    const amount = event.target.value;
    this.setState({amount});
  }

  onFormSubmit(event) {
    event.preventDefault();
    const penalizationRule = this.getSelectedPenalization();
    const selectedReason = penalizationRule.Id;
    const customReason = this.state.customReason;
    const amountText = this.state.amount;
    const amount = amountText ? parseFloat(amountText) : null;

    if (selectedReason === "Unselected") {
      this.onError(new Error("No penalty selected"));

    } else if (selectedReason === "Custom") {
      if (!customReason) {
        this.onError(new Error("You need to enter why the athlete deserves this penalty"));
      } else if (amount <= 0) {
        this.onError(new Error("Penalty must be a positive number"));
      } else {
        const performance = this.getPenalizationsComponent().buildPerformance(amount);
        const penalty = {
          "IsShortPerformance": false,
          "PenalizationId": "Custom",
          "Reason": customReason,
          "ShortReason": customReason,
          "RuleInput": amount,
          "Performance": performance
        };
        this.resetState();
        this.props.onAddPenalty(penalty);
      }

    } else {
      const ruleName = this.props.rules.Name;
      const request = {
        "PenalizationId": selectedReason,
        "Input": amount,
        "Realized": this.props.realized
      };
      Api.postGlobalRulePenalization(ruleName, request).then(this.onPenalizationCalculated).catch(this.onError);
    }
  }

  onPenalizationCalculated(penalization) {
    this.resetState();
    this.props.onAddPenalty(penalization);
  }

  onError(error) {
    this.props.onAddError(error)
  }

  resetState() {
    this.setState({selectedReason: "Unselected", customReason: "", amount: "1"});
  }

  getSelectedPenalization() {
    const selectedReason = this.state.selectedReason;
    if (selectedReason === "Unselected") {
      return this.buildReasonNone();
    } else if (selectedReason === "Custom") {
      return this.buildReasonCustom();
    } else {
      const penalizations = this.props.rules.Penalizations;
      for (const penalization of penalizations) {
        if (penalization.Id === selectedReason) {
          return penalization;
        }
      }
      return this.buildReasonNone();
    }
  }

  getPenalizationsComponent() {
    return new PerformanceComponent(this.props.rules.PenalizationsTarget);
  }

  buildReasonNone() {
    return {"Id": "Unselected", "Reason": "Select penalization", "HasInput": false};
  }

  buildReasonCustom() {
    return {"Id": "Custom", "Reason": "Custom", "HasInput": true, "InputName": "Penalty (points)", "InputUnit": "p"};
  }

  buildReasonOptions() {
    const penalizations = this.props.rules.Penalizations;
    const options = penalizations.map(p => ({value: p.Id, label: p.Reason}));
    options.unshift({value: "Unselected", "label": "Unselected"});
    options.push({value: "Custom", label: "Custom"});
    return options;
  }

  render() {
    return (
      <form className="enterresults-add-penalty-form" onSubmit={this.onFormSubmit}>
        <FormGroup label="Penalizations">{this.renderExistingPenalizations()}</FormGroup>
        {this.renderReason()}
        {this.renderAmount()}
        <Button type="submit">Add penalization</Button>
      </form>
    );
  }

  renderExistingPenalizations() {
    const existingList = this.props.result.Penalizations;
    if (!existingList) {
      return [];
    } else {
      return existingList.map((penalization, index) => this.renderExistingPenalization(penalization, index));
    }
  }

  renderExistingPenalization(penalization, index) {
    const reason = penalization.Reason;
    const penalizationComponent = this.getPenalizationsComponent();
    const value = penalizationComponent.format(penalization.Performance, true);

    return (
      <div key={index} className="enterresults-existing-penalty">
        <span className="enterresults-penalization-reason">{reason}</span>
        <span className="enterresults-penalization-value">{value}</span>
        { penalization.CardResult === "Red" && <span className="enterresults-penalization-redcard">&nbsp;</span> }
        { penalization.CardResult === "Yellow" && <span className="enterresults-penalization-yellowcard">&nbsp;</span> }
        <Button
          onClick={() => this.props.onRemovePenalty(index)}
          icon="remove"
          className={Classes.FIXED + " enterresults-penalization-remove"}/>
      </div>
    );
  }

  renderReason() {
    const reasonOptions = this.buildReasonOptions();
    const penalization = this.getSelectedPenalization();
    const selectedReason = this.state.selectedReason;
    const hasCustomReason = penalization.Id === "Custom";
    const customReason = this.state.customReason;

    return (
      <FormGroup label="Reason">
        <HTMLSelect options={reasonOptions} value={selectedReason} onChange={this.onReasonChanged} className="enterresults-penalization-selector"></HTMLSelect>
        {hasCustomReason && <InputGroup value={customReason} onChange={this.onCustomReasonChanged} placeholder="Reason"/>}
      </FormGroup>
    );
  }

  renderAmount() {
    const penalization = this.getSelectedPenalization();
    if (!penalization.HasInput) {
      return null;
    }
    const amount = this.state.amount;
    const label = penalization.InputName;
    const unit = penalization.InputUnit;

    const unitElement = unit ? <Tag minimal={true}>{unit}</Tag> : null;

    return (
      <FormGroup label={label}>
        <InputGroup value={amount} rightElement={unitElement} onChange={this.onAmountChanged}/>
      </FormGroup>
    );
  }
}

export default EnterResultPenalties;
