
import {Action} from "redux";
import {ActionsObservable} from 'redux-observable';
import {WORD__DETAIL_FETCH, WORD__SEARCH} from "../constants";
import {searchPronOfWord, searchMeansOfWord, searchExamples} from "../actions";
import {filter, map} from "rxjs/operators";
import {searchUsagesOfWord} from "../actions/meaning_usage";

export const epicFetchWordData = (action$: ActionsObservable<Action>, store: any) => {
  return action$.pipe(
    filter(action =>
      action.type === `${WORD__SEARCH}_DONE`
      || action.type === `${WORD__DETAIL_FETCH}_DONE`
    ),
    map((action: any) => (dispatch: any) => {
      const {models} = action.payload.data;
      if (models && models.length > 0) {
        const wordKeyids = models.map((model: any) => model.keyid);
        dispatch(searchMeansOfWord(wordKeyids));
        dispatch(searchUsagesOfWord(wordKeyids));
        dispatch(searchPronOfWord(wordKeyids));

        // in case fetching data of word in detail page
        if (action.type === `${WORD__DETAIL_FETCH}_DONE`) {
          dispatch(searchExamples(models[0].value.word));
        }
      }
      return;
    })
  );
};

