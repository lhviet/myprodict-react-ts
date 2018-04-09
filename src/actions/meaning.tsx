import axios from 'axios';
import {DbLimitation} from "myprodict-model/lib-esm";

import {HOST} from "../app-configs";
import {dispatchApiCallAction} from "./_action-util";

import {
  MEANING__SEARCH,
} from '../constants';

export const searchMeansOfWord = (wordKeyids: string[]) => {
  if (!wordKeyids || wordKeyids.length === 0) {
    return;
  }
  const limitation = new DbLimitation();  // search all
  const filters = { word_keyid: {in: wordKeyids} };
  const asyncAction = axios.post(HOST.api.getUrl(HOST.api.meaning.search), {limitation, filters})
    .then(res => res.data);
  return dispatchApiCallAction(MEANING__SEARCH, asyncAction);
}
