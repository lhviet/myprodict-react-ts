import {Action} from "redux";
import {ActionsObservable} from 'redux-observable';
import {filter, map} from "rxjs/operators";
import {MEANING_USAGE__SEARCH} from "../constants";
import {searchExamplesOfUsage} from "../actions/meaning_usage_example";

export const epicFetchExamplesOfUsage = (action$: ActionsObservable<Action>, store: any) => {
  return action$.pipe(
    filter(action =>
      action.type === `${MEANING_USAGE__SEARCH}_DONE`
    ),
    map((action: any) => (dispatch: any) => {
      const {models} = action.payload.data;
      if (models && models.length > 0) {
        return dispatch(searchExamplesOfUsage(models.map((u: any) => u.keyid)));
      }
    })
  );
};

