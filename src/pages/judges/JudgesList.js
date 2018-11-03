import React from 'react';
import { H5, HTMLTable, Button } from '@blueprintjs/core';

class JudgesList extends React.Component {
  render() {
    const { judges } = this.props;
    return (
      <div className="judges-list">
        <H5>Judges in competition</H5>
        <HTMLTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Devices</th>
            </tr>
          </thead>
          <tbody>
            {judges.map(judge => this.renderJudgeRow(judge))}
          </tbody>
        </HTMLTable>
      </div>
    );
  }

  renderJudgeRow(judge) {
    return (
      <tr key={judge.JudgeId}>
        <td>{judge.JudgeName}</td>
        <td>{judge.DeviceIds.length}</td>
        <td>{this.renderUnauthorizeButton(judge)}</td>
      </tr>
    );
  }

  renderUnauthorizeButton(judge) {
    const onUnauthorizeClick = () => this.props.onUnauthorizeDevicesRequested(judge);
    return (<Button type="button" minimal={true} onClick={onUnauthorizeClick} icon="lock" />);
  }
}

export default JudgesList;
