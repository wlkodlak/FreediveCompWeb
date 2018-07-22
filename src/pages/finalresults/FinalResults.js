import React from 'react';
import Api from '../../api/Api';
import { H1 } from '@blueprintjs/core';
import SingleAidaDisciplineColumn from '../finalresults/SingleAidaDisciplineColumn';
import ReducedAidaDisciplineColumn from '../finalresults/SingleAidaDisciplineColumn';
import FinalPointsColumn from '../finalresults/SingleAidaDisciplineColumn';
import ResultsReport from '../finalresults/ResultsReport';

class FinalResults extends React.Component {
  constructor(props) {
    super(props);
    this.onReportLoaded = this.onReportLoaded.bind(this);
  }

  state = {
    report: null
  }

  componentWillMount() {
    const { raceId, resultListId } = this.props;
    Api.getReportResultList(raceId, resultListId).then(this.onReportLoaded);
  }

  onReportLoaded(report) {
    this.setState({ report });
  }

  convertSingleColumn(column) {
    return new SingleAidaDisciplineColumn(column);
  }

  convertColumn(column) {
    if (column.Discipline) {
      return new ReducedAidaDisciplineColumn(column);
    } else {
      return new FinalPointsColumn(column);
    }
  }

  render() {
    if (typeof report === "object") {
      const title = report.Metadata.Title;
      const columnMetadata = report.Metadata.Columns;
      const columns = columnMetadata.map(columnMetadata.length == 1 ? this.convertSingleColumn : this.convertColumn);
      const results = report.Results;
      return (<ResultsReport title={title} results={results} columns={columns} />);
    } else {
      return (<div><H1>Final results</H1></div>);
    }
  }
}

export default FinalResults;
