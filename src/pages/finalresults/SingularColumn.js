import React from 'react';
import PerformanceComponent from '../../api/PerformanceComponent';

export default class SingularColumn {
  constructor(column) {
    this.primaryComponent = new PerformanceComponent(column.PrimaryComponent);
    this.hasPoints = column.HasFinalPoints;
  }

  renderHeader(key) {
    if (this.hasPoints) {
      return [
        <th key={`${key}_announced`}>Announced</th>,
        <th key={`${key}_realized`}>Realized</th>,
        <th key={`${key}_points`}>Points</th>,
        <th key={`${key}_card`}>Card</th>,
        <th key={`${key}_note`}>Note</th>
      ];
    } else {
      return [
        <th key={`${key}_announced`}>Announced</th>,
        <th key={`${key}_realized`}>Realized</th>,
        <th key={`${key}_card`}>Card</th>,
        <th key={`${key}_note`}>Note</th>
      ];
    }
  }

  renderData(key, result) {
    if (this.hasPoints) {
      return [
        <td key={`${key}_announced`}>{this.formatAnnounced(result)}</td>,
        <td key={`${key}_realized`}>{this.formatRealized(result)}</td>,
        <td key={`${key}_points`}>{this.formatPoints(result)}</td>,
        <td key={`${key}_card`}>{this.formatCard(result)}</td>,
        <td key={`${key}_note`}>{this.formatNote(result)}</td>
      ];
    } else {
      return [
        <td key={`${key}_announced`}>{this.formatAnnounced(result)}</td>,
        <td key={`${key}_realized`}>{this.formatRealized(result)}</td>,
        <td key={`${key}_card`}>{this.formatCard(result)}</td>,
        <td key={`${key}_note`}>{this.formatNote(result)}</td>
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
    if (result.CurrentResult && result.CurrentResult.Performance) {
      return this.primaryComponent.format(result.CurrentResult.Performance, true);
    } else {
      return "";
    }
  }

  formatPoints(result) {
    if (typeof result.FinalPoints === "number") {
      return PerformanceComponent.Points.format(result.FinalPoints)
    } else if (result.CurrentResult && result.CurrentResult.FinalPerformance) {
      return PerformanceComponent.Points.format(result.CurrentResult.FinalPerformance, true);
    } else {
      return "";
    }
  }

  formatCard(result) {
    if (result.CurrentResult && result.CurrentResult.CardResult) {
      return result.CurrentResult.CardResult.toLowerCase();
    } else {
      return "";
    }
  }

  formatNote(result) {
    if (result.CurrentResult) {
      return result.CurrentResult.JudgeComment;
    } else {
      return "";
    }
  }
}
