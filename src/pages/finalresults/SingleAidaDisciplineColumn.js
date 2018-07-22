import React from 'react';
import { formatPerformance, formatPointsPerformance } from './PerformanceFormetters';

export default class SingleAidaDisciplineColumn {
  constructor(columnMetadata) {
  }

  renderHeader(key) {
    return [
      <th key={`${key}_announced`}>Announced</th>,
      <th key={`${key}_realized`}>Realized</th>,
      <th key={`${key}_points`}>Points</th>,
      <th key={`${key}_card`}>Card</th>,
      <th key={`${key}_note`}>Note</th>
    ];
  }

  renderData(key, result) {
    return [
      <td key={`${key}_announced`}>{formatAnnounced(result)}</td>,
      <td key={`${key}_realized`}>{formatRealized(result)}</td>,
      <td key={`${key}_points`}>{formatPoints(result)}</td>,
      <td key={`${key}_card`}>{formatCard(result)}</td>,
      <td key={`${key}_note`}>{formatNote(result)}</td>
    ];
  }

  formatAnnounced(result) {
    if (result.Announcement && result.Announcement.Performance) {
      return formatPerformance(result.Announcement.Performance);
    } else {
      return "";
    }
  }

  formatRealized(result) {
    if (result.CurrentResult && result.CurrentResult.Performance) {
      return formatPerformance(result.CurrentResult.Performance);
    } else {
      return "";
    }
  }

  formatPoints(result) {
    if (result.CurrentResult && result.CurrentResult.FinalPerformance) {
      return formatPointsPerformance(result.CurrentResult.FinalPerformance);
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
