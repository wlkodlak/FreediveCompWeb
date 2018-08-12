import React from 'react';
import Api from '../../api/Api';
import { H1 } from '@blueprintjs/core';
import SingleAidaDisciplineColumn from '../finalresults/SingleAidaDisciplineColumn';
import ResultsReport from '../finalresults/ResultsReport';

class DisciplineResults extends React.Component {
  constructor(props) {
    super(props);
    this.onReportLoaded = this.onReportLoaded.bind(this);
  }

  state = {
    report: null
  }

  componentWillMount() {
    const { raceId, disciplineId } = this.props;
    Api.getReportDisciplineResults(raceId, disciplineId).then(this.onReportLoaded);
  }

  onReportLoaded(report) {
    this.setState({ report });
  }

  convertColumn(column) {
    return new SingleAidaDisciplineColumn();
  }

  render() {
    const report = this.state.report;
    if (report != null && typeof report === "object") {
      const title = report.Metadata.Title;
      const columns = report.Metadata.Columns.map(this.convertColumn);
      const results = report.Results;
      return (<ResultsReport title={title} results={results} columns={columns} />);
    } else {
      return (<div><H1>Final results</H1></div>);
    }
  }
}

export default DisciplineResults;
