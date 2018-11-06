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
    this.onModeratorNotesChanged = this.onModeratorNotesChanged.bind(this);

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
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  onNameChanged(event) {
    this.changeProfile({
      FirstName: event.target.value
    });
  }

  onSurnameChanged(event) {
    this.changeProfile({
      Surname: event.target.value
    });
  }

  onClubChanged(event) {
    this.changeProfile({
      Club: event.target.value
    });
  }

  onCountryChanged(event) {
    this.changeProfile({
      CountryName: event.target.value
    });
  }

  onSexChanged(event) {
    this.changeProfile({
      Sex: event.target.value
    });
  }

  onCategoryChanged(event) {
    this.changeProfile({
      Category: event.target.value
    });
  }

  onModeratorNotesChanged(event) {
    this.changeProfile({
      ModeratorNotes: event.target.value
    });
  }

  changeProfile(change) {
    const newProfile = {
      ...this.props.profile,
      ...change
    };
    this.props.onChange(newProfile);
  }

  render() {
    if (this.props.readonly) {
      return this.renderPublic();
    } else {
      return this.renderEditable();
    }
  }

  renderPublic() {
    const profile = this.props.profile || {};
    return (
      <div className="athlete-profile">
        <H5>Profile</H5>
        <dl>
          <dt>First name</dt>
          <dd>{profile.FirstName || ""}</dd>
          <dt>Surname</dt>
          <dd>{profile.Surname || ""}</dd>
          <dt>Club</dt>
          <dd>{profile.Club || ""}</dd>
          <dt>Country</dt>
          <dd>{profile.CountryName || ""}</dd>
          <dt>Sex</dt>
          <dd>{profile.Sex || ""}</dd>
          <dt>Category</dt>
          <dd>{profile.Category || ""}</dd>
          <dt>Moderator's notes</dt>
          <dd>{profile.ModeratorNotes || ""}</dd>
        </dl>
      </div>
    );
  }

  renderEditable() {
    const profile = this.props.profile || {};
    return (
      <form onSubmit={this.onFormSubmit} className="athlete-profile">
        <H5>Profile</H5>
        <FormGroup label="Name">
          <InputGroup
            type="text"
            placeholder="First name"
            value={profile.FirstName || ""}
            onChange={this.onNameChanged} />
        </FormGroup>
        <FormGroup label="Surname">
          <InputGroup
            type="text"
            placeholder="Last name"
            value={profile.Surname || ""}
            onChange={this.onSurnameChanged} />
        </FormGroup>
        <FormGroup label="Club">
          <InputGroup
            type="text"
            placeholder="Club"
            value={profile.Club || ""}
            onChange={this.onClubChanged} />
        </FormGroup>
        <FormGroup label="Country">
          <InputGroup
            type="text"
            placeholder="Country"
            value={profile.CountryName || ""}
            onChange={this.onCountryChanged} />
        </FormGroup>
        <FormGroup label="Sex">
          <HTMLSelect
            value={profile.Sex || "Male"}
            options={this.sexOptions}
            onChange={this.onSexChanged} />
        </FormGroup>
        <FormGroup label="Category">
          <InputGroup
            type="text"
            placeholder="Category"
            value={profile.Category || ""}
            onChange={this.onCategoryChanged} />
        </FormGroup>
        <FormGroup label="Moderator's notes">
          <InputGroup
            type="text"
            placeholder="Notes"
            value={profile.ModeratorNotes || ""}
            onChange={this.onModeratorNotesChanged} />
        </FormGroup>
        <Button type="submit" text="Save changes" disabled={!this.props.dirty} />
      </form>
    );
  }
}

export default AthleteProfile;
