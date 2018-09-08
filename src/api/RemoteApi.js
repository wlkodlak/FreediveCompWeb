import GenerateUuid from './GenerateUuid';

class RemoteApi {
  constructor(baseUrl, tokenStorage) {
    this.baseUrl = baseUrl;
    this.tokenStorage = tokenStorage;
    this.cachedRaceSetup = null;
    this.cachedRaceId = null;
  }

  getGlobalCall(path) {
    const serviceUrl = this.baseUrl + "/api-1.0/global/" + path;
    return fetch(serviceUrl)
      .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 400) throw Error(response.body);
        return null;
      });
  }

  getRaceCall(raceId, path, forceAuthentication) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/" + path;
    const options = {
      method: "GET",
      url: serviceUrl,
      headers: {
        "X-Authentication-Token": forceAuthentication ? tokenStorage.getRaceToken(raceId) : null
      }
    };
    const request = new Request(serviceUrl, options);
    return fetch(request)
      .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 400) throw Error(response.body);
        return null;
      });
  }

  postRaceCall(raceId, path, postData, skipAuthentication) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/" + path;
    const options = {
      method: "POST",
      url: serviceUrl,
      headers: {
        "Content-Type": "application/json",
        "X-Authentication-Token": skipAuthentication ? null : tokenStorage.getRaceToken(raceId)
      },
      body: JSON.stringify(postData)
    };
    const request = new Request(serviceUrl, options);
    console.log(request);
    console.log(postData);
    return fetch(request)
      .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 400) throw Error(response.body);
        return null;
      });
  }

  getGlobalSearch() {
    return this.getGlobalCall("search");
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
    const promise = this.postRaceCall(raceId, "auth/authenticate", body, true);
    promise.then(response => {
      const token = response.AuthenticationToken;
      if (typeof token === "string") {
        this.tokenStorage.setRaceToken(raceId, token);
      }
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
}

export default RemoteApi;
