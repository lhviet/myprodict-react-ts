import * as React from 'react';
import { connect } from 'react-redux';
import {Redirect, Route, Switch} from 'react-router';
import {isLoggedIn} from '../../utils/auth-util';
import PageWordDetail from './PageWordDetail';
import PageWordAdd from './PageWordAdd';
import PageWordEdit from './PageWordEdit';
import AuthenticatedRoute from '../../components/_core/AuthenticatedRoute';
import './PageWord.css';

interface PageWordProps {
}
interface PageWordState {
}

class PageWord extends React.Component<PageWordProps, PageWordState> {

  constructor(props: PageWordProps) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <AuthenticatedRoute
          path="/word/add"
          component={PageWordAdd}
          isLoggedIn={isLoggedIn()}
          redirectToUrl={'/login'}
        />
        <Route path="/word/edit/:keyid_url" component={PageWordEdit}/>
        <Route path="/word/:keyid_url" component={PageWordDetail}/>
        <Redirect from="/word" to="/"/>
      </Switch>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PageWord);
