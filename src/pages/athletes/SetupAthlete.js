import React from 'react';
import { H1 } from '@blueprintjs/core';
import { Redirect } from 'react-router-dom';
import Api from '../../api/Api';
import AthleteProfile from './AthleteProfile';
import AthleteAnnouncements from './AthleteAnnouncements';
import AthleteResults from './AthleteResults';
import RoutedButton from '../../components/RoutedButton';

class SetupAthlete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allRules: [],
      profile: {},
      announcements: [],
      results: []
    };
    this.onRulesLoaded = this.onRulesLoaded.bind(this);
    this.onAthleteLoaded = this.onAthleteLoaded.bind(this);
    this.onAthleteProfileChanged = this.onAthleteProfileChanged.bind(this);
    this.onAthleteProfileSubmit = this.onAthleteProfileSubmit.bind(this);
    this.onAthleteAnnouncementsSubmit = this.onAthleteAnnouncementsSubmit.bind(this);
    this.onAthleteAnnouncementsSaved = this.onAthleteAnnouncementsSaved.bind(this);
  }

  componentDidMount() {
    const { raceId, athleteId } = this.props;
    Api.getGlobalRules().then(this.onRulesLoaded).catch(this.props.onError);
    if (athleteId !== "new") {
      Api.getAthlete(raceId, athleteId).then(this.onAthleteLoaded).catch(this.props.onError);
    } else {
      this.setState({
        profile: {
          "FirstName": "",
          "LastName": "",
          "Sex": "Male"
        },
        profileDirty: false,
        redirectToNewId: null
      });
    }
  }

  componentDidUpdate(prevProps) {
    const previousAthleteId = prevProps.athleteId;
    const newAthleteId = this.props.athleteId;
    const raceId = this.props.raceId;

    if (previousAthleteId !== newAthleteId) {
      if (newAthleteId !== "new") {
        Api.getAthlete(raceId, newAthleteId).then(this.onAthleteLoaded).catch(this.props.onError);
      } else {
        this.setState({
          profile: {
            "FirstName": "",
            "LastName": "",
            "Sex": "Male"
          },
          profileDirty: false,
          announcements: [],
          results: [],
          redirectToNewId: null
        });
      }
    }
  }

  onRulesLoaded(allRules) {
    this.setState({allRules});
  }

  onAthleteLoaded(athlete) {
    this.setState({
      profile: athlete.Profile,
      profileDirty: false,
      announcements: athlete.Announcements,
      results: athlete.Results,
    });
  }

  onAthleteProfileChanged(profile) {
    this.setState({profile, profileDirty: true});
  }

  isAdmin() {
    return this.props.userType === "Admin";
  }

  isNewAthlete() {
    return this.props.athleteId === "new";
  }

  onAthleteProfileSubmit() {
    if (this.isNewAthlete()) {
      const profile = this.state.profile;
      const newAthleteId = this.generateAthleteId(profile.FirstName, profile.Surname);
      const athleteData = {
        "Profile": {
          ...profile,
          "AthleteId": newAthleteId
        }
      };
      Api
        .postAthlete(this.props.raceId, newAthleteId, athleteData)
        .then(() => this.onAthleteProfileSaved(true, athleteData))
        .catch(this.props.onError);

    } else {
      const profile = this.state.profile;
      const athleteData = {
        "Profile": profile
      };
      Api
        .postAthlete(this.props.raceId, this.props.athleteId, athleteData)
        .then(() => this.onAthleteProfileSaved(false, athleteData))
        .catch(this.props.onError);
    }
  }

  generateAthleteId(firstName, lastName) {
    const random = Math.floor(1 + Math.random() * 1000);
    return `${firstName}-${lastName}-${random}`
      .toLowerCase().replace(/ /g, "-")
      .normalize("NFD").split("").filter(c => (c === "-") || (c >= "a" && c <= "z") || (c >= "0" && c <= "9")).join("");
  }

  onAthleteProfileSaved(wasNew, athleteData) {
    if (wasNew) {
      this.setState({
        redirectToNewId: athleteData.Profile.AthleteId,
        profile: athleteData.Profile,
        profileDirty: false
      });
    } else {
      this.setState({
        profile: athleteData.Profile,
        profileDirty: false
      });
    }
  }

  onAthleteAnnouncementsSubmit(announcements) {
    const athleteData = {
      "Announcements": announcements
    };
    Api
      .postAthlete(this.props.raceId, this.props.athleteId, athleteData)
      .then(() => this.onAthleteAnnouncementsSaved(announcements))
      .catch(this.props.onError);
  }

  onAthleteAnnouncementsSaved(changes) {
    const changedDisciplines = changes.map(a => a.DisciplineId);
    const finalAnnouncements = changes.concat(this.state.announcements.filter(a => !changedDisciplines.includes(a.DisciplineId)));
    this.setState({
      announcements: finalAnnouncements
    });
  }

  filterDiscipline(discipline, profile) {
    if (typeof profile !== "object") return true;

    if (profile.Sex != null && discipline.Sex != null && profile.Sex !== discipline.Sex) return false;
    if (profile.Category != null && profile.Category !== "" && discipline.Category != null && profile.Category !== discipline.Category) return false;
    return true;
  }

  render() {
    if (this.isNewAthlete() && this.state.redirectToNewId) {
      return (<Redirect to={`/${this.props.raceId}/athletes/${this.state.redirectToNewId}`} />);
    } else {
      return (
        <div className="athletes-form">
          {this.renderAthleteName()}
          {this.renderProfile()}
          {this.renderAnnouncements()}
          {this.renderResults()}
        </div>
      );
    }
  }

  renderAthleteName() {
    if (this.isNewAthlete()) {
      return (<H1>New athlete</H1>);
    } else {
      const raceId = this.props.raceId;
      const fullName = `${this.state.profile.FirstName} ${this.state.profile.Surname}`;
      if (this.isAdmin()) {
        return (
          <div className="athletes-title">
            <H1>{fullName}</H1>
            <RoutedButton minimal={true} icon="plus" to={`/${raceId}/athletes/new`} />
          </div>
        );
      } else {
        return (<H1>{fullName}</H1>);
      }
    }
  }

  renderProfile() {
    return (
      <AthleteProfile
        readonly={!this.isAdmin()}
        profile={this.state.profile}
        onChange={this.onAthleteProfileChanged}
        dirty={this.state.profileDirty}
        onSubmit={this.onAthleteProfileSubmit} />
    );
  }

  renderAnnouncements() {
    if (this.isNewAthlete()) return;
    const allDisciplines = this.props.raceSetup.Disciplines;
    const allowedDisciplines = allDisciplines
      .filter(discipline => this.filterDiscipline(discipline, this.state.profile))
      .map(discipline => discipline.DisciplineId);
    const announcedDisciplines = this.state.announcements.map(announcement => announcement.DisciplineId);
    const filteredDisciplines = allDisciplines
      .filter(discipline =>
        allowedDisciplines.includes(discipline.DisciplineId) ||
        announcedDisciplines.includes(discipline.DisciplineId));
    return (
      <AthleteAnnouncements
        readonly={!this.isAdmin()}
        allRules={this.state.allRules}
        announcements={this.state.announcements}
        disciplines={filteredDisciplines}
        onSubmit={this.onAthleteAnnouncementsSubmit} />
    );
  }

  renderResults() {
    return (
      <AthleteResults
        results={this.state.results} />
    );
  }
}

export default SetupAthlete;
