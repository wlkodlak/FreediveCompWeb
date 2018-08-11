import React from 'react';
import { H1 } from '@blueprintjs/core';
import Api from '../../api/Api';
import AthleteProfile from './AthleteProfile';
import AthleteAnnouncements from './AthleteAnnouncements';
import AthleteResults from './AthleteResults';

class SetupAthlete extends React.Component {
  constructor(props) {
    super(props);
    this.onAthleteLoaded = this.onAthleteLoaded.bind(this);
    this.onRaceLoaded = this.onRaceLoaded.bind(this);
    this.state = {
      athleteId: props.athleteId === "new" ? null : props.athleteId,
      profile: {},
      announcements: [],
      results: [],
      disciplines: []
    };
    this.pendingProfile = null;
    this.pendingAnnouncements = null;
  }

  componentWillMount() {
    const { raceId, athleteId } = this.props;
    Api.getRaceSetup(raceId).then(this.onRaceLoaded);
    if (athleteId !== "new") {
      Api.getAthlete(raceId, athleteId).then(this.onAthleteLoaded);
    }
  }

  onRaceLoaded(raceSetup) {
    this.setState({
      disciplines: raceSetup.Disciplines
    });
  }

  onAthleteLoaded(athlete) {
    this.setState({
      profile: athlete.Profile,
      announcements: athlete.Announcements,
      results: athlete.Results
    });
  }

  onAthleteProfileSubmit(newProfile) {
    let athleteId = this.state.athleteId;
    if (athleteId == null) {
      athleteId = this.generateAthleteId(newProfile.FirstName, newProfile.Surname);
      newProfile.AthleteId = athleteId;
      this.setState({ athleteId });
    }
    const athleteData = {
      "Profile": newProfile
    };
    this.pendingProfile = newProfile;

    Api.postAthlete(this.props.raceId, athleteId, athleteData).then(this.onAthleteProfileSaved);
  }

  onAthleteAnnouncementSubmit(newAnnouncements) {
    const athleteData = {
      "Announcements": newAnnouncements
    };
    this.pendingAnnouncements = newAnnouncements;

    Api.postAthlete(this.props.raceId, this.state.athleteId, athleteData).then(this.onAthleteAnnouncementsSaved);
  }

  onAthleteProfileSaved() {
    this.setState({
      profile: this.pendingProfile
    });
    this.pendingProfile = null;
  }

  onAthleteAnnouncementsSaved() {
    // hmm, nothing to do
  }

  render() {
    const isNewAthlete = this.state.athleteId == null;
    const fullName = `${this.state.profile.FirstName} ${this.state.profile.Surname}`;
    return (
      <div>
        {
          isNewAthlete ? <H1>New athlete</H1> : <H1>{fullName}</H1>
        }
        <AthleteProfile
          profile={this.state.profile}
          onSubmit={this.onAthleteProfileSubmit} />
        <AthleteAnnouncements
          announcements={this.state.announcements}
          disciplines={this.state.disciplines}
          onSubmit={this.onAthleteAnnouncementSubmit} />
        <AthleteResults
          results={this.state.results} />
      </div>
    );
  }
}

export default SetupAthlete;
