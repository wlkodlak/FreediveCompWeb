import React from 'react';
import Api from '../../api/Api';
import { H1 } from '@blueprintjs/core';
import SingularColumn from '../finalresults/SingularColumn';
import ReducedColumn from '../finalresults/ReducedColumn';
import FinalPointsColumn from '../finalresults/FinalPointsColumn';
import ResultsReport from '../finalresults/ResultsReport';

class FinalResults extends React.Component {
  constructor(props) {
    super(props);
    this.onReportLoaded = this.onReportLoaded.bind(this);
    this.convertColumn = this.convertColumn.bind(this);
    this.convertSingleColumn = this.convertSingleColumn.bind(this);
  }

  state = {
    report: null
  }

  componentDidMount() {
    const { raceId, resultsListId } = this.props;
    Api.getReportResultList(raceId, resultsListId).then(this.onReportLoaded).catch(this.props.onError);
  }

  onReportLoaded(report) {
    this.setState({ report });
  }

  convertSingleColumn(column) {
    return new SingularColumn(column);
  }

  convertColumn(column) {
    if (column.PrimaryComponent != null) {
      return new ReducedColumn(column);
    } else {
      return new FinalPointsColumn(column);
    }
  }

  render() {
    const report = this.state.report;
    if (report != null && typeof report === "object") {
      const title = report.Metadata.Title;
      const columnMetadata = report.Metadata.Columns;
      const columns = columnMetadata.map(columnMetadata.length === 1 ? this.convertSingleColumn : this.convertColumn);
      const results = report.Results;
      const exportHtmlLink = Api.exportReportResultsList(this.props.raceId, this.props.resultsListId, "html", "reduced");
      const exportCsvLink = Api.exportReportResultsList(this.props.raceId, this.props.resultsListId, "csv", "reduced");
      return (
        <div className="finalresults-report">
          <ResultsReport title={title} results={results} columns={columns} exportHtmlLink={exportHtmlLink} exportCsvLink={exportCsvLink} />
        </div>
      );
    } else {
      return (
        <div className="finalresults-report">
          <H1>Final results</H1>
        </div>
      );
    }
  }
}

export default FinalResults;
