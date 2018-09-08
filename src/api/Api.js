import MockedApi from './MockedApi';
import RemoteApi from './RemoteApi';
import TokenStorage from './TokenStorage';

const apiBaseUrl = process.env.REACT_APP_API;
const Api = apiBaseUrl ? new RemoteApi(apiBaseUrl, new TokenStorage()) : new MockedApi();
export default Api;
