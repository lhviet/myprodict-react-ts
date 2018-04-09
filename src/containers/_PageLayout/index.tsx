import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import NavBarTop from './components/NavBarTop';
import './PageLayout.css';
import {StoreUtil} from "../../utils/store-util";
import * as actions from "../../actions";
import {IStoreState} from "../../types";
import {IUserState} from "../../reducers/user";
import {IWordState} from "../../reducers/word";
import {Subject} from "rxjs/Subject";
import {catchError, debounceTime, switchMap} from "rxjs/operators";

interface PageLayoutProps {

  isResultListDisplay?: boolean; // enable result list to display or not

  user: IUserState;
  word: IWordState;

  setLoggedIn(token: string): any;

  searchWord(keyword: string, offset: number, limit: number): any;
}

interface PageLayoutState {
}

class PageLayout extends React.Component<PageLayoutProps, PageLayoutState> {

// create a Subject instance
  subjectSearch$: Subject<string>;

  constructor(props: PageLayoutProps, context: any) {
    super(props, context);
  }

  componentDidMount() {
    const token = StoreUtil.readToken();
    if (this.props.setLoggedIn && !!token && token.trim().length > 0) {
      this.props.setLoggedIn(token);
    }

    // subscribe to it just like an Observable
    this.subjectSearch$ = new Subject();
    this.subjectSearch$
      .pipe(
        debounceTime(300),
        // distinctUntilChanged(),  // do not need to filter similar search term
        switchMap((value: string) => {  // switch to new observable each time the term changes
          return this.props.searchWord(value, 0, 30);
        }),
        catchError(e => {
          throw new Error(e);
        }),
      )
      .subscribe();

    // init first search
    const {word} = this.props;
    if (!word.searchResult.models || word.searchResult.models.length === 0) {
      this.subjectSearch$.next('');
    }
  }

  componentWillUnmount() {
    if (!this.subjectSearch$.closed) {
      this.subjectSearch$.unsubscribe();
    }
  }

  onSearchChange = (keyword: string) => {
    this.subjectSearch$.next(keyword);
  }

  render() {
    const {children, user, word, isResultListDisplay} = this.props;
    return (<div className={'page-layout'}>
      <NavBarTop
        isResultListDisplay={isResultListDisplay || true}
        isSearching={word.isSearching}
        searchResult={word.searchResult}
        isLoggedIn={user.auth_isLoggedIn}
        userRole={user.role}
        onSearchChange={this.onSearchChange}
      />
      {children}
    </div>);
  }
}

const mapStateToProps = (state: IStoreState) => ({
  user: state.user,
  word: state.word,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setLoggedIn: (token: string) => dispatch(actions.setLoggedIn(token)),
  searchWord: (keyword: string, offset: number, limit: number) => dispatch(actions.searchWord(keyword, offset, limit))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);
