import { combineEpics } from 'redux-observable';
import {epicFetchWordData} from "./word";
import {epicFetchUserInfo} from "./user";
import {epicFetchPronsOfCurrentWord} from "./pron";
import {epicFetchExamplesOfUsage} from './m_usage';
import {epicSetCurrentWordWithUsages} from "./meaning";

export const rootEpic = combineEpics(
  epicFetchWordData,
  epicFetchUserInfo,
  epicFetchPronsOfCurrentWord,
  epicFetchExamplesOfUsage,
  epicSetCurrentWordWithUsages,
);
