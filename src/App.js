import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CreateRace from './pages/createrace/CreateRace'
import Homepage from './pages/homepage/HomePage'
import SetupJudges from './pages/judges/SetupJudges'
import StartingLanes from './pages/startinglanes/StartingLanes'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/:raceId/create" render={({ match }) => (<CreateRace raceId={match.params.raceId} />)} />
      <Route path="/:raceId/homepage" render={({ match }) => (<HomePage raceId={match.params.raceId} />)} />
      <Route path="/:raceId/judges" render={({ match }) => (<SetupJudges raceId={match.params.raceId} />)} />
      <Route path="/:raceId/startinglists" render={({ match }) => (<StartingLanes raceId={match.params.raceId} />)} />
    </Switch>
  </BrowserRouter>
);

export default App;
