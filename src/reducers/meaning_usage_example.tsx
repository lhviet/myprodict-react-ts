
import * as _ from 'lodash';
import {IMeaningExample} from "myprodict-model/lib-esm";
import {ITermExample} from "../interfaces";
import {
  MEANING_USAGE_EXAMPLE__SEARCH_OF_USAGES,
  MEANING_USAGE_EXAMPLE__SEARCH_TERM,
} from "../constants";

export interface IMeaningExampleState {
  isSearching: boolean;
  items: IMeaningExample[];
  termExamples: ITermExample[];
}
const MEANING_USAGE_EXAMPLE_STATE_INIT: IMeaningExampleState = {
  isSearching: false,
  items: [],
  termExamples: [],
};

/**
 * Process only actions of MEANING_
 * @param {IMeaningExampleState} state
 * @param action
 * @returns {IMeaningExampleState}
 */
export default(state = MEANING_USAGE_EXAMPLE_STATE_INIT, action: any): IMeaningExampleState => {

  // if this action is not belong to MEANING, return the original state
  if (action.type.indexOf('MEANING_USAGE_EXAMPLE__') !== 0)
    return state;

  if (_.startsWith(action.type, MEANING_USAGE_EXAMPLE__SEARCH_OF_USAGES)) {
    switch (action.type.substr(MEANING_USAGE_EXAMPLE__SEARCH_OF_USAGES.length)) {
      case `_START`:
        return {...state, isSearching: true};
      case `_DONE`:
        const {models} = action.payload.data;
        const mKeyids = models.map((m: any) => m.keyid);
        const items = state.items.filter(({keyid}) => mKeyids.indexOf(keyid) < 0);
        return {...state, items: _.uniq([...items, ...models]), isSearching: false};
      case `_FAILED`:
        return {...state, isSearching: false};
    }
  }
  else if (_.startsWith(action.type, MEANING_USAGE_EXAMPLE__SEARCH_TERM)) {
    switch (action.type.substr(MEANING_USAGE_EXAMPLE__SEARCH_TERM.length)) {
      case `_START`:
        return {...state, isSearching: true};
      case `_DONE`:
        const {term, models} = action.payload.data;
        const examples = models.map((m: IMeaningExample) => m.value.sentence);
        const termExample = _.find(state.termExamples, {term});
        if (termExample) {
          termExample.examples = examples;
        } else {
          // removing % symbols from `%term%`
          let pTerm = term;
          if (_.startsWith(pTerm, '%')) {
            pTerm = pTerm.substr(1);
          }
          if (_.endsWith(pTerm, '%')) {
            pTerm = pTerm.substr(0, pTerm.length - 1);
          }
          state.termExamples.push({term: pTerm.trim(), examples});
        }
        return {...state, isSearching: false};
      case `_FAILED`:
        return {...state, isSearching: false};
    }
  }

  return state;
}
