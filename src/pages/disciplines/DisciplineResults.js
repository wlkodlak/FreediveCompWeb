import React from 'react';
import Api from '../../api/Api';
import { H1, Toaster, Toast, Intent } from '@blueprintjs/core';
import SingleAidaDisciplineColumn from '../finalresults/SingleAidaDisciplineColumn';
import ResultsReport from '../finalresults/ResultsReport';
import RaceHeader from '../homepage/RaceHeader';

class DisciplineResults extends React.Component {
  constructor(props) {
    super(props);
    this.onRulesLoaded = this.onRulesLoaded.bind(this);
    this.onReportLoaded = this.onReportLoaded.bind(this);
    this.onError = this.onError.bind(this);
    this.convertColumn = this.convertColumn.bind(this);
  }

  state = {
    report: null,
    allRules: null,
    errors: []
  }

  componentDidMount() {
    const { raceId, disciplineId } = this.props;
    Api.getGlobalRules().then(this.onRulesLoaded).catch(this.onError);
    Api.getReportDisciplineResults(raceId, disciplineId).then(this.onReportLoaded).catch(this.onError);
  }

  onRulesLoaded(allRules) {
    this.setState({allRules});
  }

  onReportLoaded(report) {
    this.setState({ report });
  }

  onError(error) {
    const errors = this.state.errors.slice(0);
    errors.push(error.message);
    this.setState({
      errors: errors
    });
  }

  onErrorDismissed(index) {
    const errors = this.state.errors.slice(0);
    errors.splice(index, 1);
    this.setState({
      errors: errors
    });
  }

  convertColumn(column) {
    return new SingleAidaDisciplineColumn(column, this.state.allRules);
  }

  render() {
    const report = this.state.report;
    if (report != null && typeof report === "object") {
      const title = report.Metadata.Title;
      const columns = report.Metadata.Columns.map(this.convertColumn);
      const results = report.Results;
      return (
        <div className="finalresults-report">
          <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
          <RaceHeader raceId={this.props.raceId} page="disciplines" pageName="Disciplines" />
          <ResultsReport title={title} results={results} columns={columns} />
        </div>
      );
    } else {
      return (
        <div className="finalresults-report">
          <Toaster>{ this.state.errors.map((error, index) => <Toast intent={Intent.DANGER} message={error} onDismiss={() => this.onErrorDismissed(index)} />) }</Toaster>
          <RaceHeader raceId={this.props.raceId} page="disciplines" pageName="Disciplines" />
          <H1>Final results</H1>
        </div>
      );
    }
  }
}

export default DisciplineResults;
