import React from 'react';
import { HTMLTable, Button, Classes, InputGroup, HTMLSelect } from '@blueprintjs/core';

class SetupRaceStaringLanes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flattened: this.flattenLanes(this.props.startingLanes),
      edited: {
        id: "",
        parentId: "-",
        title: ""
      }
    }
    this.onEditLane = this.onEditLane.bind(this);
    this.onTrashLane = this.onTrashLane.bind(this);
    this.onIdChanged = this.onIdChanged.bind(this);
    this.onParentIdChanged = this.onParentIdChanged.bind(this);
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
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

  onEditLane(lane) {
    this.setState({
      edited: {
        id: lane.id,
        parentId: lane.parentId,
        title: lane.title
      }
    });
  }

  onTrashLane(trashedLane) {
    const lanesMap = {};
    const rootLanes = [];
    for (const lane of this.state.flattened) {
      if (lane.id === trashedLane.id) continue; // skip it to remove it from result
      const hierarchicalLane = {
        "StartingLaneId": lane.id,
        "ShortName": lane.title,
        "SubLanes": []
      };
      lanesMap[lane.id] = hierarchicalLane;;
      if (lane.parentId === "-") {
        rootLanes.push(hierarchicalLane);
      } else {
        const parentLane = lanesMap[lane.parentId];
        if (parentLane) {
          parentLane.SubLanes.push(hierarchicalLane);
        }
      }
    }
    this.props.onChange(rootLanes);
  }

  onIdChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        id: value
      }
    });
  }

  onParentIdChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        parentId: value
      }
    });
  }

  onTitleChanged(event) {
    const value = event.target.value;
    this.setState({
      edited: {
        ...this.state.edited,
        title: value
      }
    });
  }

  onSubmit(event) {
    const lanesMap = {};
    const rootLanes = [];
    for (const lane of this.state.flattened) {
      const finalLane = lane.id === edited.id ? edited : lane;
      const hierarchicalLane = {
        "StartingLaneId": finalLane.id,
        "ShortName": finalLane.title,
        "SubLanes": []
      };
      lanesMap[finalLane.id] = hierarchicalLane;;
      if (finalLane.parentId === "-") {
        rootLanes.push(hierarchicalLane);
      } else {
        const parentLane = lanesMap[finalLane.parentId];
        if (parentLane) {
          parentLane.SubLanes.push(hierarchicalLane);
        }
      }
    }
    this.props.onChange(rootLanes);
  }

  onReset(event) {
    this.setState({
      edited: {
        id: "",
        parentId: "-",
        title: ""
      }
    });
  }

  render() {
    return (
      <div className="setuprace-startinglanes-container">
        <HTMLTable>
          <thead>{this.renderTableHeader()}</thead>
          <tbody>
            {this.state.flattened.map(this.renderFlattenedLane)}
          </tbody>
          <tfoot>{this.renderEditorRow()}</tfoot>
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

  renderEditorRow() {
    return (
      <form onSubmit={this.onSubmit} onReset={this.onReset}>
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
          <td>
            <Button type="submit" icon="tick" />
            <Button type="reset" icon="cross" />
          </td>
        </tr>
      </form>
    );
  }
}
