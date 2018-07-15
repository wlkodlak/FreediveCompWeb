class MockedApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  postSetupRace(raceId, raceSetup) {
    console.log("postSetupRace(" + raceId + ")");
    console.log(raceSetup);
    return Promise.resolve(null);
  }
}

export default MockedApi;
