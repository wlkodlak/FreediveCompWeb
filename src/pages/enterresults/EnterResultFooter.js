import React from 'react';
import {Button} from '@blueprintjs/core';
import RoutedButton from '../../components/RoutedButton';

class EnterResultFooter extends React.Component {
  render() {
    const finalResult = this.props.component.format(this.props.result.FinalPerformance, true);
    return (
      <div className="enterresult-footer">
        <div className="enterresult-final">
          <span className="enterresult-final-label">Final result</span>
          <span className="enterresult-final-value">{finalResult}</span>
        </div>
        <Button className="enterresult-confirm" type="submit">
          {
            this.props.modified
              ? "Confirmed"
              : "Confirm"
          }
        </Button>
        <RoutedButton
          className="enterresult-go-previous"
          icon="chevron-left"
          to={this.props.previousLink}
          disabled={this.props.previousLink == null}/>
        <RoutedButton
          className="enterresult-go-next"
          icon="chevron-right"
          to={this.props.nextLink}
          disabled={this.props.nextLink == null}/>
      </div>
    );
  }
}

export default EnterResultFooter;
