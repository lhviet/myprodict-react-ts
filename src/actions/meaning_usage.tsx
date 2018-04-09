import axios from 'axios';
import {DbLimitation} from "myprodict-model/lib-esm";

import {HOST} from "../app-configs";
import {dispatchApiCallAction} from "./_action-util";

import {
  MEANING_USAGE__SEARCH,
} from '../constants';

export const searchUsagesOfWord = (wordKeyids: string[]) => {
  if (!wordKeyids || wordKeyids.length === 0) {
    return;
  }
  const limitation = new DbLimitation();  // search all
  const filters = { word_keyid: {in: wordKeyids} };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.meaning_usage.search), {limitation, filters})
    .then(res => res.data);
  return dispatchApiCallAction(MEANING_USAGE__SEARCH, asyncAction);
};
