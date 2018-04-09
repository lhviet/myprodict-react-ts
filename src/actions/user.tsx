import {createAction} from "redux-actions";
import axios, {AxiosRequestConfig} from "axios";
import {dispatchApiCallAction} from "./_action-util";
import {HOST} from "../app-configs";
import {
  USER__AUTH_SET_LOGGED_IN,
  USER__AUTH_SET_LOGGED_OUT,
  USER__FETCH_INFO,
} from "../constants";
import {StoreUtil} from "../utils/store-util";

// set Logged-in with token stored in LocalStorage
export const setLoggedIn = createAction<string>(USER__AUTH_SET_LOGGED_IN);

export const setLoggedOut = () => {
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.user.logout))
    .then(res => res.data);
  return dispatchApiCallAction(USER__AUTH_SET_LOGGED_OUT, asyncAction);
}

export const fetchUserInfo = () => {
  const reqConfig: AxiosRequestConfig = { headers: {"Authorization" : `Bearer ${StoreUtil.readToken()}`} };
  const asyncAction = Promise.all([
    axios.get(HOST.api.getUrl(HOST.api.user.loadUser), reqConfig),
    axios.get(HOST.api.getUrl(HOST.api.user.loadUserBasic), reqConfig),
  ])
    .then(([user, basic]) => {
      const userData = user.data.data;
      const basicData = basic.data.data;
      return {
        keyid: userData.keyid,
        ...userData.value,
        ...basicData.value
      };
    });
  return dispatchApiCallAction(USER__FETCH_INFO, asyncAction);
}
