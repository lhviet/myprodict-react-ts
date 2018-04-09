import {IMeaningUsage} from "myprodict-model/lib-esm";
import {MEANING_USAGE__SEARCH} from "../constants/meaning_usage";
import * as _ from 'lodash';

export interface IMeaningUsageState {
  isSearching: boolean;
  items: IMeaningUsage[];
}
const MEANING_USAGE_STATE_INIT: IMeaningUsageState = {
  isSearching: false,
  items: [],
};

/**
 * Process only actions of MEANING_
 * @param {IMeaningUsageState} state
 * @param action
 * @returns {IMeaningUsageState}
 */
export default(state = MEANING_USAGE_STATE_INIT, action: any): IMeaningUsageState => {

  // if this action is not belong to MEANING, return the original state
  if (action.type.indexOf('MEANING_USAGE__') !== 0)
    return state;

  switch (action.type) {
    case `${MEANING_USAGE__SEARCH}_START`:
      return {...state, isSearching: true};
    case `${MEANING_USAGE__SEARCH}_DONE`:
      const {models} = action.payload.data;
      const mKeyids = models.map((m: any) => m.keyid);
      const items = state.items.filter(({keyid}) => mKeyids.indexOf(keyid) < 0);
      return {...state, items: _.uniq([...items, ...models]), isSearching: false};
    case `${MEANING_USAGE__SEARCH}_FAILED`:
      return {...state, isSearching: false};
  }

  return state;
}
