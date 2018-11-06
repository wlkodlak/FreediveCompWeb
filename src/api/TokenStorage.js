import GenerateUuid from './GenerateUuid';

class TokenStorage {
  getDeviceId() {
    let deviceId = window.localStorage.getItem("deviceId");
    if (deviceId == null) {
      deviceId = GenerateUuid();
      window.localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  }

  getRaceToken(raceId) {
    const raceToken = window.localStorage.getItem("raceToken-" + raceId);
    const adminToken = window.localStorage.getItem("adminToken");
    return raceToken || adminToken;
  }

  saveRaceToken(raceId, token) {
    window.localStorage.setItem("raceToken-" + raceId, token);
  }

  saveGlobalToken(token) {
    window.localStorage.clear();
    window.localStorage.setItem("adminToken", token);
  }
}

export default TokenStorage;
