import MockedApi from './MockedApi';
import RemoteApi from './RemoteApi';

const apiBaseUrl = process.env.REACT_APP_API;
const Api = apiBaseUrl ? new RemoteApi(apiBaseUrl) : new MockedApi();
export default Api;
