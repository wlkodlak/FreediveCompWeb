import React from 'react';
import { H5, FormGroup, InputGroup, Button, HTMLSelect } from '@blueprintjs/core';

class AthleteProfile extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onSurnameChanged = this.onSurnameChanged.bind(this);
    this.onClubChanged = this.onClubChanged.bind(this);
    this.onCountryChanged = this.onCountryChanged.bind(this);
    this.onSexChanged = this.onSexChanged.bind(this);
    this.onCategoryChanged = this.onCategoryChanged.bind(this);

    this.sexOptions = [
      {
        label: "Male",
        value: "Male"
      },
      {
        label: "Female",
        value: "Female"
      }
    ];

    let profile = this.props.profile;
    if (profile == null) profile = {};
    this.state = {
      name: this.emptyIfNull(profile.FirstName),
      surname: this.emptyIfNull(profile.Surname),
      club: this.emptyIfNull(profile.Club),
      country: this.emptyIfNull(profile.Country),
      category: this.emptyIfNull(profile.Category),
      sex: profile.Sex === "Female" ? "Male" : "Female"
    };
  }

  emptyIfNull(s) {
    return typeof s === "string" ? s : "";
  }

  onFormSubmit(event) {
    event.preventDefault();
    const newProfile = {
      ...this.props.profile,
      "FirstName": this.state.name,
      "Surname": this.state.surname,
      "Club": this.state.club,
      "Country": this.state.country,
      "Category": this.state.category,
      "Sex": this.state.sex
    };
    this.props.onSubmit(newProfile);
  }

  onNameChanged(event) {
    this.setState({
      name: event.target.value
    });
  }

  onSurnameChanged(event) {
    this.setState({
      surname: event.target.value
    });
  }

  onClubChanged(event) {
    this.setState({
      club: event.target.value
    });
  }

  onCountryChanged(event) {
    this.setState({
      country: event.target.value
    });
  }

  onSexChanged(event) {
    this.setState({
      sex: event.target.value
    });
  }

  onCategoryChanged(event) {
    this.setState({
      category: event.target.value
    });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <H5>Profile</H5>
        <FormGroup label="Name">
          <InputGroup
            type="text"
            placeholder="First name"
            value={this.state.name}
            onChange={this.onNameChanged} />
        </FormGroup>
        <FormGroup label="Surname">
          <InputGroup
            type="text"
            placeholder="Last name"
            value={this.state.surname}
            onChange={this.onSurnameChanged} />
        </FormGroup>
        <FormGroup label="Club">
          <InputGroup
            type="text"
            placeholder="Club"
            value={this.state.club}
            onChange={this.onClubChanged} />
        </FormGroup>
        <FormGroup label="Country">
          <InputGroup
            type="text"
            placeholder="Country"
            value={this.state.country}
            onChange={this.onCountryChanged} />
        </FormGroup>
        <FormGroup label="Sex">
          <HTMLSelect
            value={this.state.sex}
            options={this.sexOptions}
            onChange={this.onSexChanged} />
        </FormGroup>
        <FormGroup label="Category">
          <InputGroup
            type="text"
            placeholder="Category"
            value={this.state.category}
            onChange={this.onCategoryChanged} />
        </FormGroup>
        <Button type="submit" text="Save changes" />
      </form>
    );
  }
}

export default AthleteProfile;
