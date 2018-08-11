class RemoteApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cachedRaceSetup = null;
    this.cachedRaceId = null;
  }

  getGlobalCall(path) {
    const serviceUrl = this.baseUrl + "/api-1.0/global/" + path;
    return fetch(serviceUrl)
      .then(response => {
        if (response.status === 200) return response.json;
        if (response.status === 400) throw Error(response.body);
        return null;
      });
  }

  getRaceCall(raceId, path) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/" + path;
    return fetch(serviceUrl)
      .then(response => {
        if (response.status === 200) return response.json;
        if (response.status === 400) throw Error(response.body);
        return null;
      });
  }

  postRaceCall(raceId, path, postData) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/" + path;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    };
    return fetch(serviceUrl, requestOptions)
      .then(response => {
        if (response.status === 200) return response.json;
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
  }

  getAuthJudges(raceId) {
    return this.getRaceCall(raceId, "auth/judges");
  }

  postAuthAuthorize(raceId, authorizeRequest) {
    return this.postRaceCall(raceId, "auth/authorize", authorizeRequest);
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

  postStartingList(raceId, startingLaneId, entries) {
    return this.postRaceCall(raceId, "start/" + startingLaneId, entries);
  }
  
  getNewRaceId() {
    const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    const randomUuid =
      randomHex() + randomHex() + "-" +
      randomHex() + "-" +
      "4" + randomHex().substring(1) + "-" +
      "a" + randomHex().substring(1) + "-" +
      randomHex() + randomHex() + randomHex();
    return randomUuid;
  }
}

export default RemoteApi;
