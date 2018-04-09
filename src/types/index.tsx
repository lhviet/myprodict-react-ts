import {IWordState} from "../reducers/word";
import {IMeaningState} from "../reducers/meaning";
import {IUserState} from "../reducers/user";
import {ISearchState} from "../reducers/search";
import {IPronState} from "../reducers/pronunciation";
import {IMeaningUsageState} from "../reducers/meaning_usage";
import {IMeaningExampleState} from "../reducers/meaning_usage_example";

export interface IStoreState {
  word?: IWordState,
  pron?: IPronState,
  meaning?: IMeaningState,
  meaning_usage?: IMeaningUsageState,
  meaning_usage_example?: IMeaningExampleState,
  search?: ISearchState,
  user?: IUserState,
}
