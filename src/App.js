import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CreateRace from './pages/createrace/CreateRace'
import Homepage from './pages/homepage/HomePage'
import SetupJudges from './pages/judges/SetupJudges'
import StartingLanes from './pages/startinglanes/StartingLanes'
import Disciplines from './pages/disciplines/DisciplinesList'

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
        render={({ match }) => (<FinalResults raceId={match.params.raceId} disciplineId={match.params.resultListId} />)} />
      <Route
        path="/:raceId/resultlists"
        render={({ match }) => (<FinalReportsList raceId={match.params.raceId} />)} />
    </Switch>
  </BrowserRouter>
);

export default App;
