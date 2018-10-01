import React from 'react';
import {Button} from '@blueprintjs/core';
import RoutedButton from '../../components/RoutedButton';

class EnterResultFooter extends React.Component {
  render() {
    const finalResult = this.props.component.format(this.props.result.FinalPerformance, true);
    return (
      <div className="enterresults-footer">
        <div className="enterresults-final">
          <span className="enterresults-final-label">Final result</span>
          <span className="enterresults-final-value">{finalResult}</span>
        </div>
        <div className="enterresults-buttons">
          <Button className="enterresults-confirm" type="submit">
            {
              this.props.modified
                ? "Confirm"
                : "Confirmed"
            }
          </Button>
          <RoutedButton
            className="enterresults-go-previous"
            icon="chevron-left"
            to={this.props.previousLink}
            disabled={this.props.previousLink == null}/>
          <RoutedButton
            className="enterresults-go-next"
            icon="chevron-right"
            to={this.props.nextLink}
            disabled={this.props.nextLink == null}/>
        </div>
      </div>
    );
  }
}

export default EnterResultFooter;
