import {
  // SEARCH_WORD
} from "../constants";

export interface ISearchState {
  isSearching: boolean;
}
const SEARCH_STATE_INIT: ISearchState = {
  isSearching: false,
};

/**
 * Process only actions of SEARCH_
 * @param {ISearchState} state
 * @param action
 * @returns {ISearchState}
 */
export default(state = SEARCH_STATE_INIT, action: any): ISearchState => {

  // if this action is not belong to SEARCH, return the original state
  if (action.type.indexOf('SEARCH__') !== 0)
    return state;

  switch (action.type) {
  }

  return state;
}
