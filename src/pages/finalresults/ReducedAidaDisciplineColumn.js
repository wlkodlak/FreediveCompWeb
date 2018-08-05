import React from 'react';
import { formatPerformance, formatPointsPerformance } from './PerformanceFormatters';

export default class ReducedAidaDisciplineColumn {
  constructor(columnMetadata) {
    this.title = columnMetadata.Title;
  }

  renderHeader(key) {
    return [
      <th key={`${key}_header`} colSpan="2">{this.title}</th>
    ];
  }

  renderData(key, result) {
    return [
      <td key={`${key}_performance`}>{formatRealized(result)}</td>,
      <td key={`${key}_points`}>{formatPoints(result)}</td>
    ];
  }

  formatRealized(result) {
    if (result.CurrentResult) {
      return formatPerformance(result.CurrentResult.Performance);
    } else {
      return "";
    }
  }

  formatPoints(result) {
    if (result.CurrentResult) {
      return formatPointsPerformance(result.CurrentResult.Performance);
    } else {
      return "";
    }
  }
}
