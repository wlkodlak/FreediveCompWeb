import React from 'react';
import { H5, FormGroup, InputGroup, Button, HTMLSelect } from '@blueprintjs/core';

class ConnectCodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.onConnectCodeChanged = this.onConnectCodeChanged.bind(this);
    this.onJudgeIdChanged = this.onJudgeIdChanged.bind(this);
    this.onJudgeNameChanged = this.onJudgeNameChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    connectCode: "",
    judgeId: "new",
    judgeName: ""
  }

  onConnectCodeChanged(event) {
    this.setState({
      connectCode: event.target.value
    });
  }

  onJudgeIdChanged(event) {
    const judgeId = event.target.value;
    if (judgeId === "new") {
      this.setState({ judgeId });
    } else {
      const judge = this.props.judges.find(judge => judge.JudgeId === judgeId);
      const judgeName = judge === undefined ? "" : judge.JudgeName;
      this.setState({judgeId, judgeName});
    }
  }

  onJudgeNameChanged(event) {
    this.setState({
      judgeName: event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    let judgeId = this.state.judgeId;
    const judgeName = this.state.judgeName;
    const connectCode = this.state.connectCode;
    if (judgeId === "new") judgeId = this.generateJudgeId(judgeName);
    if (connectCode === "" || judgeName === "") return; // nothing prepared, ignore
    this.props.onAuthorizeDeviceRequested(judgeId, judgeName, connectCode);
    this.setState({connectCode: ""});
  }

  generateJudgeId(judgeName) {
    return judgeName
      .toLowerCase().replace(/" "/g, "-")
      .normalize("NFD").split("").filter(c => (c === "-") || (c >= "a" && c <= "z")).join("");
  }

  render() {
    const judgeOptions = this.props.judges.map(judge => ({ value: judge.JudgeId, label: judge.JudgeName }));
    judgeOptions.splice(0, 0, { value: "new", label: "New judge" });
    return (
      <form onSubmit={this.onSubmit} className="judges-connectcode">
        <H5>Authorize judge's device</H5>
        <FormGroup label="Connect code">
          <InputGroup
            type="text"
            placeholder="Connect code"
            value={this.state.connectCode}
            onChange={this.onConnectCodeChanged} />
        </FormGroup>
        <FormGroup label="Judge">
          <HTMLSelect
            value={this.state.judgeId}
            options={judgeOptions}
            onChange={this.onJudgeIdChanged} />
          <InputGroup
            type="text"
            placeholder="Name"
            disabled={this.state.judgeId !== "new"}
            value={this.state.judgeName}
            onChange={this.onJudgeNameChanged} />
        </FormGroup>
        <Button
          type="submit"
          text="Authorize device"
          disabled={this.state.connectCode === "" || this.state.judgeName === ""} />
      </form>
    );
  }
}

export default ConnectCodeForm;
