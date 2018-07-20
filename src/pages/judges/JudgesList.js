import React from 'react';
import { FormGroup, ControlGroup, InputGroup, Button, HTMLSelect, HTMLTable, H5 } from '@blueprintjs/core';

class JudgesList extends React.Component {
  render() {
    return (
      <div>
        <h1>Setup Judges</h1>
        <JudgesList judges={this.state.judges} newJudgeName={this.state.newJudgeName} />
        <ConnectCodeForm judges={this.state.judges} connectCode={this.state.connectCode} />
      </div>
    );
  }
}

export default JudgesList;
