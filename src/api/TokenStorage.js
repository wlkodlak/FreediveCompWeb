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
    return window.localStorage.getItem("raceToken-" + raceId);
  }

  saveRaceToken(raceId, token) {
    window.localStorage.setItem("raceToken-" + raceId, token);
  }
}
