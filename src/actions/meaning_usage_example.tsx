import axios from 'axios';
import {DbLimitation} from "myprodict-model/lib-esm";

import {HOST} from "../app-configs";
import {dispatchApiCallAction} from "./_action-util";

import {
  MEANING_USAGE_EXAMPLE__SEARCH_OF_USAGES,
  MEANING_USAGE_EXAMPLE__SEARCH_TERM,
} from '../constants';

export const searchExamplesOfUsage = (uKeyids: string[]) => {
  const limitation = new DbLimitation();  // search all
  const filters = { meaning_usage_keyid: {in: uKeyids} };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.meaning_usage_example.search), {limitation, filters})
    .then(res => res.data);
  return dispatchApiCallAction(MEANING_USAGE_EXAMPLE__SEARCH_OF_USAGES, asyncAction);
};

export const searchExamples = (term: string) => {
  const limitation = new DbLimitation(0, 120);
  const filters = { sentence: `% ${term} %` };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.meaning_usage_example.search), {limitation, filters})
    .then(res => res.data);
  return dispatchApiCallAction(MEANING_USAGE_EXAMPLE__SEARCH_TERM, asyncAction);
};
