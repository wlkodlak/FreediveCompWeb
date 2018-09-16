import React from 'react';
import PerformanceComponent from '../../api/PerformanceComponent';

export default class ReducedAidaDisciplineColumn {
  constructor(column, allRules) {
    this.title = column.Title;
    this.primaryComponent = PerformanceComponent.findPrimaryForDiscipline(column.Discipline.Rules, allRules);
    this.pointsComponent = PerformanceComponent.Points;
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
      return this.primaryComponent.format(result.CurrentResult.Performance, true);
    } else {
      return "";
    }
  }

  formatPoints(result) {
    if (result.CurrentResult) {
      return this.pointsComponent.format(result.CurrentResult.Performance, true);
    } else {
      return "";
    }
  }
}
