
import {Action} from "redux";
import {ActionsObservable} from 'redux-observable';
import {PRON__SAVE} from "../constants";
import {searchPronOfWord} from "../actions";
import {filter, map} from "rxjs/operators";

export const epicFetchPronsOfCurrentWord = (action$: ActionsObservable<Action>, store: any) => {
  return action$.pipe(
    filter(action =>
      action.type === `${PRON__SAVE}_DONE`
    ),
    map(() => (dispatch: any) => {
      const {currentWordKeyid} = store.getState().word;
      return dispatch(searchPronOfWord([currentWordKeyid]));
    })
  );
};

