import React from 'react';
import Api from '../../api/Api';
import { H1 } from '@blueprintjs/core';
import SingularColumn from '../finalresults/SingularColumn';
import ResultsReport from '../finalresults/ResultsReport';

class DisciplineResults extends React.Component {
  constructor(props) {
    super(props);
    this.onRulesLoaded = this.onRulesLoaded.bind(this);
    this.onReportLoaded = this.onReportLoaded.bind(this);
    this.convertColumn = this.convertColumn.bind(this);
  }

  state = {
    report: null,
    allRules: null
  }

  componentDidMount() {
    const { raceId, disciplineId } = this.props;
    Api.getGlobalRules().then(this.onRulesLoaded).catch(this.props.onError);
    Api.getReportDisciplineResults(raceId, disciplineId).then(this.onReportLoaded).catch(this.props.onError);
  }

  onRulesLoaded(allRules) {
    this.setState({allRules});
  }

  onReportLoaded(report) {
    this.setState({ report });
  }

  convertColumn(column) {
    return new SingularColumn(column);
  }

  render() {
    const report = this.state.report;
    if (report != null && typeof report === "object") {
      const title = report.Metadata.Title;
      const columns = report.Metadata.Columns.map(this.convertColumn);
      const results = report.Results;
      const exportHtmlLink = Api.exportReportDisciplineResults(this.props.raceId, this.props.disciplineId, "html", "reduced");
      const exportCsvLink = Api.exportReportDisciplineResults(this.props.raceId, this.props.disciplineId, "csv", "reduced");
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

export default DisciplineResults;
