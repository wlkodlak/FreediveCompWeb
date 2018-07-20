import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CreateRace from './pages/createrace/CreateRace'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/:raceId/create" render={({ match }) => (<CreateRace raceId={match.params.raceId} />)} />
      <Route path="/:raceId/homepage" render={({ match }) => (<HomePage raceId={match.params.raceId} />)} />
    </Switch>
  </BrowserRouter>
);

export default App;
