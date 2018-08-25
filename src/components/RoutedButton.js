import React from 'react';
import { Button } from '@blueprintjs/core';
import { withRouter } from 'react-router-dom';

class RoutedButton extends React.Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(event) {
    this.props.history.push(this.props.to);
  }

  render() {
    const { to, children, ...others } = this.props;
    return (<Button onClick={this.onButtonClick} {...others}>{children}</Button>);
  }
}

export default withRouter(RoutedButton);
