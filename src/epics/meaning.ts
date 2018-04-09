import {Action} from "redux";
import {ActionsObservable} from 'redux-observable';
import {filter, map} from "rxjs/operators";
import * as _ from 'lodash';
import {MEANING__SEARCH,} from "../constants";
import {searchExamples, setCurrentWord} from "../actions";

export const epicSetCurrentWordWithUsages = (action$: ActionsObservable<Action>, store: any) => {
  return action$.pipe(
    filter(action =>
      action.type === `${MEANING__SEARCH}_DONE`
    ),
    map((action: any) => (dispatch: any) => {
      const {models} = action.payload.data;
      if (models.length) {
        const currentWord = _.find(store.getState().word.searchResult.models, {keyid: models[0].value.word_keyid});
        if (currentWord) {
          dispatch(setCurrentWord(currentWord.keyid));
          dispatch(searchExamples(currentWord.value.word));
        }
      }
    })
  );
};

