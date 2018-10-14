import React from 'react';
import { Button } from '@blueprintjs/core';

class SetupRaceSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.onToggleExpand = this.onToggleExpand.bind(this);
  }

  onToggleExpand() {
    this.setState((state) => ({ expanded: !state.expanded }));
  }

  render() {
    const expanded = this.state.expanded;
    return (
      <div className="setuprace-title">
        <div className="setuprace-title-header">
          <h1>{this.props.title}</h1>
          <Button
            minimal={true}
            icon={expanded ? "chevron-up" : "chevron-down"}
            onClick={this.onToggleExpand} />
        </div>
        { !expanded && <div className="setuprace-title-summary">{this.props.summary}</div> }
        { expanded && this.props.children}
      </div>
    );
  }
}

export default SetupRaceSettings;
