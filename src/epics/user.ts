import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {USER__AUTH_SET_LOGGED_IN} from "../constants";
import {fetchUserInfo} from "../actions";

export const epicFetchUserInfo = (action$: any, store: any) =>
  action$.pipe(
    ofType(`${USER__AUTH_SET_LOGGED_IN}`),
    map((action: any) => (dispatch: any) => {
      if (!!action.payload) {
        dispatch(fetchUserInfo())
      }
    })
  );
