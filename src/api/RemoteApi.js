class RemoteApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getRaceCall(raceId, path) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/" + path;
    return fetch(serviceUrl)
      .then(response => {
        if (response.status == 200) return response.json;
        if (response.status == 400) throw Error(response.body);
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
        if (response.status == 200) return response.json;
        if (response.status == 400) throw Error(response.body);
        return null;
      });
  }

  postRaceSetup(raceId, raceSetup) {
    return postRaceCall(raceId, "setup", raceSetup);
  }

  getRaceSetup(raceId) {
    return getRaceCall(raceId, "setup");
  }

  getAuthJudges(raceId) {
    return getRaceCall(raceId, "auth/judges");
  }

  postAuthAuthorize(raceId, authorizeRequest) {
    return postRaceCall(raceId, "auth/authorize", authorizeRequest);
  }

  getReportStartingList(raceId, laneId) {
    return getRaceCall(raceId, "reports/start/" + laneId);
  }

  getReportDisciplineResults(raceId, disciplineId) {
    return getRaceCall(raceId, "reports/discipline/" + disciplineId);
  }

  getReportResultList(raceId, resultListId) {
    return getRaceCall(raceId, "reports/results/" + resultsListId);
  }
}

export default RemoteApi;
