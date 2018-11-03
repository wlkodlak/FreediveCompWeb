import GenerateUuid from './GenerateUuid';

class RemoteApi {
  constructor(baseUrl, tokenStorage) {
    this.baseUrl = baseUrl;
    this.tokenStorage = tokenStorage;
    this.cachedRaceSetup = null;
    this.cachedRaceId = null;
    this.cachedRules = null;
  }

  fetchJson(request) {
    return fetch(request).then(response => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status >= 400 && response.status < 500) {
        const contentType = response.headers.get("Content-Type");
        if (contentType.startsWith("application/json") || contentType.startsWith("text/json")) {
          return response.json().then(this.buildErrorPromise);
        } else {
          return response.text().then(this.buildErrorPromise);
        }
      } else if (response.status >= 500) {
        return Promise.reject(new Error("Server error " + response.status));
      } else if (response.status > 200 && response.status < 300) {
        return Promise.resolve(null);
      } else {
        return Promise.reject(new Error("Unexpected response " + response.status));
      }
    });
  }

  buildErrorPromise(message) {
    if (typeof message === "object") {
      message = message.Message;  // from WebAPI
    } else if (typeof message === "string") {
      // noop - already a string
    } else {
      message = "An error occurred";
    }
    return Promise.reject(new Error(message));
  }

  getGlobalCall(path) {
    const serviceUrl = this.baseUrl + "/api-1.0/global/" + path;
    return this.fetchJson(serviceUrl);
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
    return this.fetchJson(request);
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
    return this.fetchJson(request);
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
    return this.fetchJson(request);
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

  postAuthUnauthorize(raceId, unauthorizeRequest) {
    return this.postRaceCall(raceId, "auth/unauthorize", unauthorizeRequest);
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

  exportReport(raceId, kind, id, format, preset) {
    return this.baseUrl + "/api-1.0/" + raceId + "/exports/" + kind + "/" + id + "?format=" + format + "&preset=" + preset;
  }

  exportReportStartingList(raceId, startingLaneId, format, preset) {
    return this.exportReport(raceId, "start", startingLaneId, format, preset);
  }

  exportReportDisciplineResults(raceId, disciplineId, format, preset) {
    return this.exportReport(raceId, "discipline", disciplineId, format, preset);
  }

  exportReportResultsList(raceId, resultsListId, format, preset) {
    return this.exportReport(raceId, "results", resultsListId, format, preset);
  }
}

export default RemoteApi;
