import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import CreateRace from './pages/createrace/CreateRace';
import HomePage from './pages/homepage/HomePage';
import SetupJudges from './pages/judges/SetupJudges';
import AuthenticateJudge from './pages/judges/AuthenticateJudge';
import GeneratorTool from './pages/startinglanes/GeneratorTool';
import StartingList from './pages/startinglanes/StartingList';
import StartingLanes from './pages/startinglanes/StartingLanes';
import DisciplineResults from './pages/disciplines/DisciplineResults';
import DisciplinesList from './pages/disciplines/DisciplinesList';
import FinalResults from './pages/finalresults/FinalResults';
import FinalReportsList from './pages/finalresults/FinalReportsList';
import SetupAthletes from './pages/athletes/SetupAthletes';
import SetupAthlete from './pages/athletes/SetupAthlete';
import EnterResult from './pages/enterresults/EnterResult';
import NoRace from './pages/norace/NoRace';
import BadPath from './pages/norace/BadPath';
import Api from './api/Api';

function extractQueryParameter(location, name) {
  if (!location || location.length === 0) {
    return null;
  }
  var vars = location.substring(1).split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === name) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}

function ExtractAuthenticationToken(props) {
  const token = extractQueryParameter(props.location.search, "token");
  const raceId = props.match.raceId;
  if (typeof token === "string") {
    Api.saveExplicitToken(raceId, token);
  }
  return null;
}

const App = () => (
  <BrowserRouter>
    <div>
      <Route path="/" exact render={ExtractAuthenticationToken} />
      <Route path="/:raceId" render={ExtractAuthenticationToken} />
      <Switch>
        <Route
          path="/:raceId/create"
          render={({ match }) => (<CreateRace raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/homepage"
          render={({ match }) => (<HomePage raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/judges"
          render={({ match }) => (<SetupJudges raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/authenticate"
          render={({ match }) => (<AuthenticateJudge raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/startinglists/generator"
          render={({ match }) => (<GeneratorTool raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/startinglists/:laneId"
          render={({ match }) => (<StartingList raceId={match.params.raceId} startingLaneId={match.params.laneId} />)} />
        <Route
          path="/:raceId/startinglists"
          render={({ match }) => (<StartingLanes raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/disciplines/:disciplineId"
          render={({ match }) => (<DisciplineResults raceId={match.params.raceId} disciplineId={match.params.disciplineId} />)} />
        <Route
          path="/:raceId/disciplines"
          render={({ match }) => (<DisciplinesList raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/resultlists/:resultListId"
          render={({ match }) => (<FinalResults raceId={match.params.raceId} resultListId={match.params.resultListId} />)} />
        <Route
          path="/:raceId/resultlists"
          render={({ match }) => (<FinalReportsList raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/athletes/:athleteId"
          render={({ match }) => (<SetupAthlete raceId={match.params.raceId} athleteId={match.params.athleteId} />)} />
        <Route
          path="/:raceId/athletes"
          render={({ match }) => (<SetupAthletes raceId={match.params.raceId} />)} />
        <Route
          path="/:raceId/enterresults/:laneId/:athleteId/:disciplineId"
          render={({ match }) => (
            <EnterResult
              raceId={match.params.raceId}
              startingLaneId={match.params.laneId}
              athleteId={match.params.athleteId}
              disciplineId={match.params.disciplineId} />
            )}
          />
        <Route
          path="/:raceId/"
          exact
          render={({ match }) => (<Redirect to={`/${match.params.raceId}/homepage`} />)} />
        <Route
          path="/"
          exact
          render={({ match }) => (<NoRace />)} />
        <Route
          render={({ match }) => (<BadPath />)} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
