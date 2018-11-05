import React from 'react';
import moment from 'moment';
import { Button, HTMLTable } from '@blueprintjs/core';
import PerformanceComponent from '../../api/PerformanceComponent';

export default class AssignmentsEditor extends React.Component {
  render() {
    return (
      <div>
        <HTMLTable>
          <thead>
            <tr>
              <th>OT</th>
              <th>Lane</th>
              <th>Move</th>
              <th>Athlete</th>
              <th>Announced</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.startingList.map(slot => this.renderRow(slot))
            }
          </tbody>
        </HTMLTable>
        <Button text="Confirm start list" onClick={() => this.props.onConfirm()} />
      </div>
    );
  }

  renderRow(slot) {
    const lastPosition = this.props.startingList.length - 1;
    const canMoveUp = slot.Position > 0 && !!slot.AssignedAthleteStart;
    const canMoveDown = slot.Position < lastPosition && !!slot.AssignedAthleteStart;
    const moveUp = () => this.props.onSwap(slot.Position, slot.Position - 1);
    const moveDown = () => this.props.onSwap(slot.Position, slot.Position + 1);

    const formattedOfficialTop = moment(slot.OfficialTop).format("HH:mm");
    const athleteName = slot.AssignedAthleteStart ? slot.AssignedAthleteStart.AthleteFullName : "";
    const formattedAnnouncement = slot.AssignedAthleteStart ? PerformanceComponent.formatPerformance(slot.AssignedAthleteStart.Announcement) : "";

    return (
      <tr key={slot.Position}>
        <td>{formattedOfficialTop}</td>
        <td>{slot.StartingLaneName}</td>
        <td>
          <Button icon="symbol-triangle-up" onClick={moveUp} minimal={true} disabled={!canMoveUp} />
          <Button icon="symbol-triangle-down" onClick={moveDown} minimal={true} disabled={!canMoveDown} />
        </td>
        <td>{athleteName}</td>
        <td>{formattedAnnouncement}</td>
      </tr>
    );
  }
}
