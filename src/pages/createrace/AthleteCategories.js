import React from 'react';
import { ControlGroup, InputGroup, H5, Button, Text, Classes } from '@blueprintjs/core';

class AthleteCategories extends React.Component {
  constructor(props) {
    super(props);
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onNameKey = this.onNameKey.bind(this);
    this.onAddClicked = this.onAddClicked.bind(this);
    this.onRemoveClicked = this.onRemoveClicked.bind(this);
  }

  state = {
    name: ""
  }

  onNameChanged(event) {
    this.setState({name: event.target.value});
  }

  onNameKey(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onAddClicked();
    }
  }

  onAddClicked() {
    const name = this.state.name;
    const categories = this.props.value;
    const alteredCategories = [...categories, name];
    const onChange = this.props.onChange;

    this.setState({name: ""});
    onChange(alteredCategories);
  }

  onRemoveClicked(name) {
    const categories = this.props.value;
    const removedIndex = categories.indexOf(name);
    const onChange = this.props.onChange;
    if (removedIndex >= 0) {
      const alteredCategories = categories.slice(0);
      alteredCategories.splice(removedIndex, 1);
      onChange(alteredCategories);
    }
  }

  render() {
    const name = this.state.name;
    const categories = this.props.value;

    return (<div className="createrace-categories">
      <H5>Athlete categories</H5>
      <ControlGroup fill={true}>
        <InputGroup value={name} onChange={this.onNameChanged} onKeyPress={this.onNameKey} />
        <Button onClick={this.onAddClicked} icon="add" className={Classes.FIXED} />
      </ControlGroup>
      {categories.map(category =>
        <ControlGroup key={category} fill={true}>
          <Text>{category}</Text>
          <Button onClick={() => this.onRemoveClicked(category)} icon="remove" className={Classes.FIXED} />
        </ControlGroup>
      )}
    </div>);
  }
}

export default AthleteCategories;
