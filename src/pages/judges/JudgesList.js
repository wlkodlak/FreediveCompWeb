import React from 'react';
import { HTMLTable } from '@blueprintjs/core';

class JudgesList extends React.Component {
  render() {
    const { judges } = this.props;
    return (
      <HTMLTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Devices</th>
          </tr>
        </thead>
        {
          judges.map(judge => (
            <tr key={judge.JudgeId}>
              <td>{judge.JudgeName}</td>
              <td>{judge.DeviceIds.length}</td>
            </tr>
          ))
        }
      </HTMLTable>
    );
  }
}

export default JudgesList;
