import {
  PRON__DELETE, PRON__OF_WORD_FETCH,
  // PRON__FETCH,
  // PRON__OF_WORD_FETCH,
  PRON__SAVE,
} from "../constants";
import {IPronunciation} from "myprodict-model/lib-esm";
import * as _ from "lodash";

export interface IPronState {
  isDeleting: boolean;
  isSaving: boolean;
  isSearching: boolean;
  items: IPronunciation[];
}
const PRON_STATE_INIT: IPronState = {
  isDeleting: false,
  isSaving: false,
  isSearching: false,
  items: [],
};

/**
 * Process only actions of PRON_
 * @param {IPronState} state
 * @param action
 * @returns {IPronState}
 */
export default(state = PRON_STATE_INIT, action: any): IPronState => {

  // if this action is not belong to PRON, return the original state
  if (action.type.indexOf('PRON__') !== 0)
    return state;

  switch (action.type) {

    case `${PRON__DELETE}_START`:
      return {...state, isDeleting: true};
    case `${PRON__DELETE}_DONE`:
      const keyid = action.payload;
      const foundPron = state.items.find(item => item.keyid === keyid);
      if (foundPron) {
        state.items.splice(state.items.indexOf(foundPron), 1);
      }
      return {...state, isDeleting: false};
    case `${PRON__DELETE}_FAILED`:
      return {...state, isDeleting: false};

    case `${PRON__SAVE}_START`:
      return {...state, isSaving: true};
    case `${PRON__SAVE}_DONE`:
    case `${PRON__SAVE}_FAILED`:
      return {...state, isSaving: false};

    case `${PRON__OF_WORD_FETCH}_START`:
      return {...state, isSearching: true};
    case `${PRON__OF_WORD_FETCH}_DONE`:
      const {models} = action.payload.data;
      const mKeyids = models.map((m: any) => m.keyid);
      const items = state.items.filter(({keyid}) => mKeyids.indexOf(keyid) < 0);
      return {...state, items: _.uniq([...items, ...models]), isSearching: false};
    case `${PRON__OF_WORD_FETCH}_FAILED`:
      return {...state, items: [], isSearching: false};

  }

  return state;
}
