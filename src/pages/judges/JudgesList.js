import React from 'react';
import { H5, HTMLTable } from '@blueprintjs/core';

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
            {
              judges.map(judge => (
                <tr key={judge.JudgeId}>
                  <td>{judge.JudgeName}</td>
                  <td>{judge.DeviceIds.length}</td>
                </tr>
              ))
            }
          </tbody>
        </HTMLTable>
      </div>
    );
  }
}

export default JudgesList;
