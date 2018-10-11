import GenerateUuid from './GenerateUuid';

class RemoteApi {
  constructor(baseUrl, tokenStorage) {
    this.baseUrl = baseUrl;
    this.tokenStorage = tokenStorage;
    this.cachedRaceSetup = null;
    this.cachedRaceId = null;
    this.cachedRules = null;
  }

  getGlobalCall(path) {
    const serviceUrl = this.baseUrl + "/api-1.0/global/" + path;
    return fetch(serviceUrl)
      .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 400) return response.text().then(t => Promise.reject(new Error(t)));
        return null;
      });
  }

  postGlobalCall(path, postData) {
    const serviceUrl = this.baseUrl + "/api-1.0/global/" + path;
    const options = {
      method: "POST",
      url: serviceUrl,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    };
    const request = new Request(serviceUrl, options);
    console.log(request);
    console.log(postData);
    return fetch(request)
      .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 400) return response.text().then(t => Promise.reject(new Error(t)));
        return null;
      });
  }

  getRaceCall(raceId, path, forceAuthentication) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/" + path;
    const token = forceAuthentication ? this.tokenStorage.getRaceToken(raceId) : null;
    const options = {
      method: "GET",
      url: serviceUrl,
      headers: {
      }
    };
    if (token) {
      options.headers["X-Authentication-Token"] = token;
    }
    const request = new Request(serviceUrl, options);
    return fetch(request)
      .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 400) return response.text().then(t => Promise.reject(new Error(t)));
        return null;
      });
  }

  postRaceCall(raceId, path, postData, skipAuthentication) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/" + path;
    var token = skipAuthentication ? null : this.tokenStorage.getRaceToken(raceId);
    const options = {
      method: "POST",
      url: serviceUrl,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    };
    if (token) {
      options.headers["X-Authentication-Token"] = token;
    }
    const request = new Request(serviceUrl, options);
    console.log(request);
    console.log(postData);
    return fetch(request)
      .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 400) return response.text().then(t => Promise.reject(new Error(t)));
        return null;
      });
  }

  getGlobalSearch() {
    return this.getGlobalCall("search");
  }

  getGlobalRules() {
    if (this.cachedRules != null) {
      return this.cachedRules;
    }

    this.cachedRules = this.getGlobalCall("rules");
    this.cachedRules.catch(error => {
      this.cachedRules = null
    });
    return this.cachedRules;
  }

  postGlobalRuleCall(ruleName, path, body) {
    return this.postGlobalCall("rules/" + ruleName + "/" + path, body);
  }

  postGlobalRulePoints(ruleName, performance) {
    return this.postGlobalRuleCall(ruleName, "points", performance);
  }

  postGlobalRuleShort(ruleName, request) {
    return this.postGlobalRuleCall(ruleName, "short", request);
  }

  postGlobalRulePenalization(ruleName, request) {
    return this.postGlobalRuleCall(ruleName, "penalization", request);
  }

  postRaceSetup(raceId, raceSetup) {
    this.cachedRaceSetup = null;
    return this.postRaceCall(raceId, "setup", raceSetup);
  }

  getRaceSetup(raceId) {
    if (this.cachedRaceSetup != null && this.cachedRaceId === raceId) {
      return this.cachedRaceSetup;
    }

    this.cachedRaceSetup = this.getRaceCall(raceId, "setup");
    this.cachedRaceId = raceId;
    this.cachedRaceSetup.catch(error => {
      this.cachedRaceSetup = null;
    });
    return this.cachedRaceSetup;
  }

  getAuthJudges(raceId) {
    return this.getRaceCall(raceId, "auth/judges");
  }

  getAuthVerify(raceId) {
    return this.getRaceCall(raceId, "auth/verify", true);
  }

  postAuthAuthorize(raceId, authorizeRequest) {
    return this.postRaceCall(raceId, "auth/authorize", authorizeRequest);
  }

  postAuthAuthenticate(raceId, connectCode) {
    const body = {
      "DeviceId": this.tokenStorage.getDeviceId(),
      "ConnectCode": connectCode
    };
    let promise = this.postRaceCall(raceId, "auth/authenticate", body, true);
    promise = promise.then(response => {
      const token = response.AuthenticationToken;
      if (typeof token === "string") {
        this.tokenStorage.saveRaceToken(raceId, token);
      }
      return response;
    });
    return promise;
  }

  getReportStartingList(raceId, laneId) {
    return this.getRaceCall(raceId, "reports/start/" + laneId);
  }

  getReportDisciplineResults(raceId, disciplineId) {
    return this.getRaceCall(raceId, "reports/discipline/" + disciplineId);
  }

  getReportResultList(raceId, resultsListId) {
    return this.getRaceCall(raceId, "reports/results/" + resultsListId);
  }

  getAthletes(raceId) {
    return this.getRaceCall(raceId, "athletes");
  }

  getAthlete(raceId, athleteId) {
    return this.getRaceCall(raceId, "athletes/" + athleteId);
  }

  postAthlete(raceId, athleteId, athleteData) {
    return this.postRaceCall(raceId, "athletes/" + athleteId, athleteData);
  }

  postAthleteResult(raceId, athleteId, result) {
    return this.postRaceCall(raceId, "athletes/" + athleteId + "/results", result);
  }

  postStartingList(raceId, startingLaneId, entries) {
    return this.postRaceCall(raceId, "start/" + startingLaneId, entries);
  }

  getNewRaceId() {
    return GenerateUuid();
  }

  saveExplicitToken(raceId, token) {
    if (raceId) {
      this.tokenStorage.saveRaceToken(raceId, token);
    } else {
      this.tokenStorage.saveGlobalToken(token);
    }
  }
}

export default RemoteApi;
