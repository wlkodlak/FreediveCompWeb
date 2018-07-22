import React from 'react';

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
      <td key={key}>{`${result.FinalPoints}`}</td>
    ];
  }
}
