import {createAction} from 'redux-actions';
import axios, {AxiosRequestConfig} from 'axios';

import {HOST} from "../app-configs";
import {dispatchApiCallAction} from "./_action-util";

import {
  WORD__ADD,
  WORD__UPDATE,
  WORD__DELETE,
  WORD__SET_CURRENT,
  WORD__CHECK_WORD_EXISTING,
  WORD__CHECK_URL_EXISTING,
  WORD__SAVE,
  WORD__DETAIL_FETCH,
  WORD__SEARCH,
} from '../constants';
import {StoreUtil} from "../utils/store-util";
import {DbLimitation} from "myprodict-model/lib-esm";

export const addNewWord = createAction(WORD__ADD);
export const updateWord = createAction(WORD__UPDATE);
export const deleteWord = createAction(WORD__DELETE);

export const setCurrentWord = createAction<string>(WORD__SET_CURRENT);

export const searchWord = (keyword: string, offset: number, limit: number) => {
  const filters = {};
  if (keyword && keyword.trim().length > 0) {
    filters['word'] = keyword + '%';
  }
  const data = {
    filters,
    limitation: new DbLimitation(offset, limit, keyword ? 'word' : ''),
  };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.word.search), data)
    .then(res => res.data);
  return dispatchApiCallAction(WORD__SEARCH, asyncAction);
}

export const fetchWord = (keyid_url: string) => {
  const data = {filters: {
    [keyid_url]: ['keyid', 'custom_url']
  }};
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.word.search), data)
    .then(res => res.data);
  return dispatchApiCallAction(WORD__DETAIL_FETCH, asyncAction);
}

export const checkWordExisting = (url: string) => {
  const asyncAction = axios.get(HOST.api.getUrl(HOST.api.word.is_existing) + url)
    .then(res => res.data);
  return dispatchApiCallAction(WORD__CHECK_WORD_EXISTING, asyncAction);
}

export const checkWordUrlExisting = (url: string) => {
  const asyncAction = axios.get(HOST.api.getUrl(HOST.api.word.is_url_existing) + url)
    .then(res => res.data);
  return dispatchApiCallAction(WORD__CHECK_URL_EXISTING, asyncAction);
}

export const submitWord = (value: any) => {
  const reqConfig: AxiosRequestConfig = { headers: {"Authorization" : `Bearer ${StoreUtil.readToken()}`} };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.word.save), value, reqConfig)
    .then(res => res.data);
  return dispatchApiCallAction(WORD__SAVE, asyncAction);
}

