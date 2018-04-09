import {
  WORD__CHECK_WORD_EXISTING, WORD__CHECK_URL_EXISTING, WORD__SAVE, WORD__DETAIL_FETCH,
  WORD__SET_CURRENT, WORD__SEARCH
} from "../constants";
import {IWord} from "myprodict-model/lib-esm";

export interface IWordState {
  isWordExisting: boolean;
  isWordChecking: boolean;
  isUrlExisting: boolean;
  isUrlChecking: boolean;
  isSaving: boolean;
  isFetchingWord: boolean;
  isSearching: boolean;
  currentWordKeyid: string;
  wordItem?: IWord;  // store fetching data of word in WORD__DETAIL_FETCH
  searchResult: {
    models?: IWord[],
    total?: number
  };
}
const WORD_STATE_INIT: IWordState = {
  isWordExisting: true,
  isWordChecking: false,
  isUrlExisting: true,
  isUrlChecking: false,
  isSaving: false,
  isFetchingWord: false,
  isSearching: false,
  currentWordKeyid: '',
  searchResult: {},
};

/**
 * Process only actions of WORD__
 * @param {IWordState} state
 * @param action
 * @returns {IWordState}
 */
export default(state = WORD_STATE_INIT, action: any): IWordState => {

  // if this action is not belong to WORD, return the original state
  if (action.type.indexOf('WORD__') !== 0)
    return state;

  switch (action.type) {
    case `${WORD__SET_CURRENT}`:
      return {...state, currentWordKeyid: action.payload};

    case `${WORD__SEARCH}_START`:
      return {...state, isSearching: true};
    case `${WORD__SEARCH}_DONE`:
      return {...state, searchResult: action.payload.data, isSearching: false};
    case `${WORD__SEARCH}_FAILED`:
      return {...state, isSearching: false};

    case `${WORD__CHECK_WORD_EXISTING}_START`:
      return {...state, isWordExisting: false, isWordChecking: true};
    case `${WORD__CHECK_WORD_EXISTING}_DONE`:
    case `${WORD__CHECK_WORD_EXISTING}_FAILED`:
      return {...state, isWordExisting: !!action.payload, isWordChecking: false};

    case `${WORD__CHECK_URL_EXISTING}_START`:
      return {...state, isUrlExisting: false, isUrlChecking: true};
    case `${WORD__CHECK_URL_EXISTING}_DONE`:
    case `${WORD__CHECK_URL_EXISTING}_FAILED`:
      return {...state, isUrlExisting: !!action.payload, isUrlChecking: false};

    case `${WORD__SAVE}_START`:
      return {...state, isSaving: true};
    case `${WORD__SAVE}_DONE`:
    case `${WORD__SAVE}_FAILED`:
      return {...state, isSaving: false};

    case `${WORD__DETAIL_FETCH}_START`:
      return {...state, isFetchingWord: true};
    case `${WORD__DETAIL_FETCH}_DONE`:
      const word = action.payload.data.models[0];
      return {...state, wordItem: word, isFetchingWord: false};
    case `${WORD__DETAIL_FETCH}_FAILED`:
      return {...state, isFetchingWord: false};
  }

  return state;
}
