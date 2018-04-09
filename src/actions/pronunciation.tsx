import axios, {AxiosRequestConfig} from 'axios';

import {HOST} from "../app-configs";
import {dispatchApiCallAction} from "./_action-util";

import {
  PRON__DELETE,
  PRON__FETCH,
  PRON__OF_WORD_FETCH,
  PRON__SAVE,
} from '../constants';
import {StoreUtil} from "../utils/store-util";
import {DbLimitation} from "myprodict-model/lib-esm";

export const deletePron = (keyid: string) => {
  const reqConfig: AxiosRequestConfig = { headers: {"Authorization" : `Bearer ${StoreUtil.readToken()}`} };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.pron.delete), { keyid }, reqConfig)
    .then(res => res.data);
  return dispatchApiCallAction(PRON__DELETE, asyncAction);
};

export const fetchPron = (keyid: string) => {
  const data = {filters: { keyid }};
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.pron.search), data)
    .then(res => res.data);
  return dispatchApiCallAction(PRON__FETCH, asyncAction);
};

export const submitPron = (value: any) => {
  const reqConfig: AxiosRequestConfig = { headers: {"Authorization" : `Bearer ${StoreUtil.readToken()}`} };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.pron.save), value, reqConfig)
    .then(res => res.data);
  return dispatchApiCallAction(PRON__SAVE, asyncAction);
};

export const searchPronOfWord = (word_keyids: string[]) => {
  const data = {
    limitation: new DbLimitation(),
    filters: { word_keyid: {in: word_keyids} },
  };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.pron.search), data)
    .then(res => res.data);
  return dispatchApiCallAction(PRON__OF_WORD_FETCH, asyncAction);
};

