import MockedApi from './MockedApi';
import RemoteApi from './RemoteApi';
import TokenStorage from './TokenStorage';

function createApi() {
  let apiBaseUrl = process.env.REACT_APP_API;
  if (apiBaseUrl === "mocked") return new MockedApi();
  if (apiBaseUrl === "auto" || !apiBaseUrl) {
    const regex = /^(https?:\/\/[^/]*)/;
    const match = regex.exec(window.location.href);
    apiBaseUrl = match[1];
  }
  return new RemoteApi(apiBaseUrl, new TokenStorage());
}

const Api = createApi();
export default Api;
