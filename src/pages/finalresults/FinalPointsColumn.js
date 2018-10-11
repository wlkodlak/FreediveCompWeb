import React from 'react';
import PerformanceComponent from '../../api/PerformanceComponent';

export default class FinalPointsColumn {
  constructor(columnMetadata) {
    this.title = columnMetadata.Title;
  }

  renderHeader(key) {
    return [
      <th key={key}>{this.title}</th>
    ];
  }

  renderData(key, result) {
    return [
      <td key={key}>{this.formatPoints(result)}</td>
    ];
  }

  formatPoints(result) {
    if (typeof result.FinalPoints === "number") {
      return PerformanceComponent.Points.format(result.FinalPoints, true)
    } else {
      return "";
    }
  }
}
