import React from 'react';
import { HTMLTable, Button, Classes, InputGroup, HTMLSelect } from '@blueprintjs/core';

class SetupRaceStaringLanes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flattened: this.flattenLanes(this.props.startingLanes),
      edited: {
        id: "",
        parentId: null,
        title: ""
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.startingLanes === this.props.startingLanes) return;
    this.setState({
      flattened: this.flattenLanes(this.props.startingLanes);
    })
  }

  flattenLanes(hierarchicalLanes) {
    const flattenedLanes = [];
    this.flattenLanesInto(hierarchicalLanes, flattenedLanes, "-", 0);
    return flattenedLanes;
  }

  flattenLanesInto(hierarchicalLanes, flattenedLanes, parentId, level) {
    if (!hierarchicalLanes) return;
    for (const hierarchicalLane of hierarchicalLanes) {
      flattenLanes.push({
        id: hierarchicalLane.StartingLaneId,
        parentId: parentId,
        level: level,
        title: hierarchicalLane.ShortName,
      });
      this.flattenLanesInto(
        hierarchicalLane.SubLanes, flattenLanes,
        hierarchicalLane.StartingLaneId, level + 1);
    }
  }

  render() {
    return (
      <div className="setuprace-startinglanes-container">
        <HTMLTable>
          <thead>{this.renderTableHeader()}</thead>
          <tbody>
            {this.state.flattened.map(this.renderFlattenedLane)}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <InputGroup
                  type="text"
                  value={this.state.edited.id}
                  onChange={this.onIdChanged} />
              </td>
              <td>
                <HTMLSelect
                  value={this.state.edited.parentId}
                  options={this.buildParentOptions())}
                  onChange={this.onParentIdChanged} />
              </td>
              <td>
                <InputGroup
                  type="text"
                  value={this.state.edited.title}
                  onChange={this.onTitleChanged} />
              </td>
            </tr>
          </tfoot>
        </HTMLTable>
      </div>
    );
  }

  renderTableHeader() {
    return (
      <tr>
        <th>Id</th>
        <th>Parent</th>
        <th>Title</th>
        <th>Actions</th>
      </tr>
    );
  }

  renderFlattenedLane(lane, index) {
    return (
      <tr key={lane.id}>
        <td>{lane.id}</td>
        <td>{lane.parentId}</td>
        <td>{lane.title}</td>
        <td>
          <Button type="button" icon="edit" onClick={() => this.onEditLane(lane)} />
          <Button type="button" icon="trash" onClick={() => this.onTrashLane(lane)} />
        </td>
      </tr>
    );
  }

  buildParentOptions() {
    const options = [];
    options.push({ label: "(none)", value="-"});
    for (const lane of this.state.flattened) {
      options.push({ label: lane.id, value: lane.id });
    }
    return options;
  }
}
