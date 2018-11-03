import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import CreateRace from './pages/createrace/CreateRace';
import SetupRace from './pages/setuprace/SetupRace';
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
import RacePage from './pages/RacePage';
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

function buildRacePageRoute(path, component, superPath, superName) {
  return React.createElement(Route, {
    path: "/:raceId/" + path,
    render: (props) => {
      const params = props.match.params;
      const token = extractQueryParameter(props.location.search, "token");
      if (typeof token === "string") {
        Api.saveExplicitToken(params.raceId, token);
      }
      return React.createElement(RacePage, {
        ...params,
        component,
        superPath,
        superName
      });
    }
  });
}

function renderHomepageRedirect(props) {
  return React.createElement(Redirect, { to: `/${props.match.params.raceId}/homepage` });
}

function renderRootRoute(props) {
  const token = extractQueryParameter(props.location.search, "token");
  if (typeof token === "string") {
    Api.saveExplicitToken(null, token);
  }
  return React.createElement(NoRace, null)
}

function App() {
  const homepageRedirectRoute = React.createElement(Route,
    {
      path: "/:raceId/",
      exact: true,
      render: renderHomepageRedirect
    });
  const rootRoute = React.createElement(Route,
    {
      path: "/",
      exact: true,
      render: renderRootRoute
    });
  const badPathRoute = React.createElement(Route,
    {
      render: () => React.createElement(BadPath, null)
    });

  const routes = [
    buildRacePageRoute("create", CreateRace),
    buildRacePageRoute("setup", SetupRace),
    buildRacePageRoute("homepage", HomePage),
    buildRacePageRoute("judges", SetupJudges),
    buildRacePageRoute("authenticate", AuthenticateJudge),
    buildRacePageRoute("startinglists/generator", GeneratorTool),
    buildRacePageRoute("startinglists/:startingLaneId", StartingList, "startinglists", "Starting lists"),
    buildRacePageRoute("startinglists", StartingLanes),
    buildRacePageRoute("disciplines/:disciplineId", DisciplineResults, "disciplines", "Disciplines"),
    buildRacePageRoute("disciplines", DisciplinesList),
    buildRacePageRoute("resultlists/:resultsListId", FinalResults, "resultslists", "Result lists"),
    buildRacePageRoute("resultlists", FinalReportsList),
    buildRacePageRoute("athletes/:athleteId", SetupAthlete, "athletes", "Athletes"),
    buildRacePageRoute("athletes", SetupAthletes),
    buildRacePageRoute("enterresults/:startingLaneId/:athleteId/:disciplineId", EnterResult),
    homepageRedirectRoute,
    rootRoute,
    badPathRoute
  ];

  return React.createElement(BrowserRouter, null, React.createElement(Switch, null, routes));
}

export default App;
