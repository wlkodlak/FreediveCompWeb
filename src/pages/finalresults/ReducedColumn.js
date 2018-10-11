import React from 'react';
import PerformanceComponent from '../../api/PerformanceComponent';

export default class ReducedColumn {
  constructor(column) {
    this.title = column.Title;
    this.primaryComponent = new PerformanceComponent(column.PrimaryComponent);
    this.hasPoints = column.HasFinalPoints;
  }

  renderHeader(key) {
    const span = this.hasPoints ? "3" : "2";
    return [
      <th key={`${key}_header`} colSpan={span}>{this.title}</th>
    ];
  }

  renderData(key, result) {
    if (this.hasPoints) {
      return [
        <td key={`${key}_announced`}>{this.formatAnnounced(result)}</td>,
        <td key={`${key}_performance`}>{this.formatRealized(result)}</td>,
        <td key={`${key}_points`}>{this.formatPoints(result)}</td>
      ];
    } else {
      return [
        <td key={`${key}_announced`}>{this.formatAnnounced(result)}</td>,
        <td key={`${key}_performance`}>{this.formatRealized(result)}</td>,
      ];
    }
  }

  formatAnnounced(result) {
    if (result.Announcement && result.Announcement.Performance) {
      return this.primaryComponent.format(result.Announcement.Performance, true);
    } else {
      return "";
    }
  }

  formatRealized(result) {
    if (result.CurrentResult) {
      return this.primaryComponent.format(result.CurrentResult.Performance, true);
    } else {
      return "";
    }
  }

  formatPoints(result) {
    if (typeof result.FinalPoints === "number") {
      return PerformanceComponent.Points.format(result.FinalPoints, true)
    } else if (result.CurrentResult) {
      return PerformanceComponent.Points.format(result.CurrentResult.FinalPerformance, true);
    } else {
      return "";
    }
  }
}
