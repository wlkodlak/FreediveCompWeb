import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateRace from './pages/createrace/CreateRace';
import HomePage from './pages/homepage/HomePage';
import SetupJudges from './pages/judges/SetupJudges';
import GeneratorTool from './pages/startinglanes/GeneratorTool';
import StartingList from './pages/startinglanes/StartingList';
import StartingLanes from './pages/startinglanes/StartingLanes';
import DisciplineResults from './pages/disciplines/DisciplineResults';
import DisciplinesList from './pages/disciplines/DisciplinesList';
import FinalResults from './pages/finalresults/FinalResults';
import FinalReportsList from './pages/finalresults/FinalReportsList';
import SetupAthletes from './pages/athletes/SetupAthletes';
import SetupAthlete from './pages/athletes/SetupAthlete';
import NoRace from './pages/norace/NoRace';
import BadPath from './pages/norace/BadPath';

const App = () => (
  <BrowserRouter>
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
        path="/"
        exact
        render={({ match }) => (<NoRace />)} />
      <Route
        render={({ match }) => (<BadPath />)} />
    </Switch>
  </BrowserRouter>
);

export default App;
