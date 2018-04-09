import {EUserRole} from "myprodict-model/lib-esm";
import {USER__AUTH_SET_LOGGED_IN, USER__AUTH_SET_LOGGED_OUT, USER__FETCH_INFO} from "../constants";
import {StoreUtil} from "../utils/store-util";
import removeToken = StoreUtil.removeToken;

export interface IUserState {
  // auth
  auth_isLoggedIn: boolean;
  // user
  keyid: string;
  username: string;
  email: string;
  displayname: string;
  avatar_url: string;
  cover_url: string;
  home_url: string;
  gender: string;
  language: string;
  country: string;
  role: EUserRole;
}

const USER_STATE_INIT: IUserState = {
  auth_isLoggedIn: false,

  keyid: '',
  username: '',
  email: '',
  displayname: '',
  avatar_url: '',
  cover_url: '',
  home_url: '',
  gender: '',
  language: '',
  country: '',
  role: EUserRole.User,
};

/**
 * Process only actions of WORD__
 * @param {IUserState} state
 * @param action
 * @returns {IUserState}
 */
export default(state = USER_STATE_INIT, action: any): IUserState => {

  // if this action is not belong to WORD, return the original state
  if (action.type.indexOf('USER__') !== 0)
    return state;

  switch (action.type) {
    case `${USER__AUTH_SET_LOGGED_IN}`:
      StoreUtil.storeToken(action.payload);
      return {...state, auth_isLoggedIn: true};

    // async actions

    case `${USER__AUTH_SET_LOGGED_OUT}_DONE`:
      StoreUtil.removeToken();
      return {...state, auth_isLoggedIn: false};

    case `${USER__FETCH_INFO}_DONE`:
      const {keyid, username, email, displayname, avatar_url, cover_url, home_url, gender, language, country, role} = action.payload;
      return {
        ...state,
        keyid, username, email, displayname, avatar_url, cover_url, home_url, gender, language, country, role
      };
    case `${USER__FETCH_INFO}_FAILED`:
      // remove auth_token
      removeToken();
      return { ...state, auth_isLoggedIn: false};
  }

  return state;
}
