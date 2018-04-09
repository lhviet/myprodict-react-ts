import {MEANING__SEARCH} from "../constants";
import {IMeaning} from "myprodict-model/lib-esm";
import * as _ from 'lodash';

export interface IMeaningState {
  isSearching: boolean;
  items: IMeaning[];
}
const MEANING_STATE_INIT: IMeaningState = {
  isSearching: false,
  items: [],
};

/**
 * Process only actions of MEANING_
 * @param {IMeaningState} state
 * @param action
 * @returns {IMeaningState}
 */
export default(state = MEANING_STATE_INIT, action: any): IMeaningState => {

  // if this action is not belong to MEANING, return the original state
  if (action.type.indexOf('MEANING__') !== 0)
    return state;

  switch (action.type) {
    case `${MEANING__SEARCH}_START`:
      return {...state, isSearching: true};
    case `${MEANING__SEARCH}_DONE`:
      const {models} = action.payload.data;
      const mKeyids = models.map((m: any) => m.keyid);
      const items = state.items.filter(({keyid}) => mKeyids.indexOf(keyid) < 0);
      return {...state, items: _.uniq([...items, ...models]), isSearching: false};
    case `${MEANING__SEARCH}_FAILED`:
      return {...state, isSearching: false};
  }

  return state;
}
