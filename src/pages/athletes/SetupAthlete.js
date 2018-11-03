import React from 'react';
import { H1 } from '@blueprintjs/core';
import Api from '../../api/Api';
import AthleteProfile from './AthleteProfile';
import AthleteAnnouncements from './AthleteAnnouncements';
import AthleteResults from './AthleteResults';
import RoutedButton from '../../components/RoutedButton';

class SetupAthlete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      athleteId: props.athleteId === "new" ? null : props.athleteId,
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
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const previousAthleteId = this.props.athleteId;
    const newAthleteId = nextProps.athleteId;
    const raceId = nextProps.raceId;

    if (previousAthleteId !== newAthleteId) {
      this.setState({
        athleteId: newAthleteId === "new" ? null : newAthleteId,
      });

      if (newAthleteId !== "new") {
        Api.getAthlete(raceId, newAthleteId).then(this.onAthleteLoaded).catch(this.props.onError);
      } else {
        this.setState({
          profile: {
            "FirstName": "",
            "LastName": "",
            "Sex": "Male"
          },
          results: []
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
      announcements: athlete.Announcements,
      results: athlete.Results
    });
  }

  onAthleteProfileChanged(profile) {
    this.setState({profile});
  }

  onAthleteProfileSubmit() {
    let profile = this.state.profile;
    let athleteId = this.state.athleteId;
    if (athleteId == null) {
      athleteId = this.generateAthleteId(profile.FirstName, profile.Surname);
      profile = {
        ...profile,
        "AthleteId": athleteId
      };
      this.setState({ athleteId, profile });
    }
    const athleteData = {
      "Profile": profile
    };
    Api.postAthlete(this.props.raceId, athleteId, athleteData).then(this.onAthleteProfileSaved).catch(this.props.onError);
  }

  generateAthleteId(firstName, lastName) {
    const random = Math.floor(1 + Math.random() * 1000);
    return `${firstName}-${lastName}-${random}`
      .toLowerCase().replace(" ", "-")
      .normalize("NFD").split("").filter(c => (c === "-") || (c >= "a" && c <= "z") || (c >= "0" && c <= "9")).join("");
  }

  onAthleteProfileSaved() {
    // hmm, nothing to do
  }

  onAthleteAnnouncementsSubmit(announcements) {
    const athleteData = {
      "Announcements": announcements
    };
    Api.postAthlete(this.props.raceId, this.state.athleteId, athleteData).then(this.onAthleteAnnouncementsSaved).catch(this.props.onError);
  }

  onAthleteAnnouncementsSaved() {
    // hmm, nothing to do
  }

  filterDiscipline(discipline, profile) {
    if (typeof profile !== "object") return true;

    if (profile.Sex != null && discipline.Sex != null && profile.Sex !== discipline.Sex) return false;
    if (profile.Category != null && profile.Category !== "" && discipline.Category != null && profile.Category !== discipline.Category) return false;
    return true;
  }

  render() {
    const filteredDisciplines = this.props.raceSetup.Disciplines.filter(discipline => this.filterDiscipline(discipline, this.state.profile));
    return (
      <div className="athletes-form">
        {this.renderAthleteName()}
        <AthleteProfile
          profile={this.state.profile}
          onChange={this.onAthleteProfileChanged}
          onSubmit={this.onAthleteProfileSubmit} />
        <AthleteAnnouncements
          allRules={this.state.allRules}
          announcements={this.state.announcements}
          disciplines={filteredDisciplines}
          onSubmit={this.onAthleteAnnouncementsSubmit} />
        <AthleteResults
          results={this.state.results} />
      </div>
    );
  }

  renderAthleteName() {
    const isNewAthlete = this.state.athleteId == null;
    if (isNewAthlete) {
      return (<H1>New athlete</H1>);
    } else {
      const raceId = this.props.raceId;
      const fullName = `${this.state.profile.FirstName} ${this.state.profile.Surname}`;
      return (
        <div className="athletes-title">
          <H1>{fullName}</H1>
          <RoutedButton minimal={true} icon="plus" to={`/${raceId}/athletes/new`} />
        </div>
      );
    }
  }
}

export default SetupAthlete;
