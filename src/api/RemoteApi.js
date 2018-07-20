class RemoteApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  postRaceSetup(raceId, raceSetup) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/setup";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(raceSetup)
    };
    return fetch(serviceUrl, requestOptions)
    .then(response => response.status === 200 ? response.json : null);
  }

  getRaceSetup(raceId) {
    const serviceUrl = this.baseUrl + "/api-1.0/" + raceId + "/setup";
    return fetch(serviceUrl)
    .then(response => response.status === 200 ? response.json : null);
  }
}

export default RemoteApi;
