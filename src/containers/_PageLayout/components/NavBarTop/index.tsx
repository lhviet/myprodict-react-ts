import * as React from 'react';
import './NavBarTop.css';
import SearchInputField from "../../../../components/_core/SearchInputField";
import {NavLink} from "react-router-dom";
import {EUserRole, isAdminOrSuperAdmin} from "myprodict-model/lib-esm";

const LOGO_URL = 'http://d2p04xt0pdicv1.cloudfront.net/images/logo.png';

interface NavBarTopProps {
  isResultListDisplay: boolean; // enable result list to display or not
  isSearching: boolean;
  searchResult: any;
  isLoggedIn: boolean;
  userRole: EUserRole;
  onSearchChange(keyword: string): any;
}

const NavBarTop = ({ isLoggedIn, isSearching, isResultListDisplay, userRole, searchResult, onSearchChange }: NavBarTopProps) => {
  const items = searchResult.models && searchResult.models.length > 9 ?
    searchResult.models.slice(0, 9) : [];
  return (
    <nav className="nav-bar-top navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a className="navbar-brand" href="/">
        <img className="brand" src={LOGO_URL}/>
      </a>
      <div className="search-bar">
        <SearchInputField
          isSearching={isSearching}
          onChange={onSearchChange}
          items={items}
          isResultListDisplay={isResultListDisplay}
        />
      </div>
      <NavLink to="/" className={'a-bright'} activeClassName={'active'} exact={true}>
        <i className={"fa fa-home fa-2x"} />
      </NavLink>
      {isLoggedIn && isAdminOrSuperAdmin(userRole) &&
        <NavLink to="/word/add" className={'a-bright'} activeClassName={'active'}>
          <i className={"fa fa-plus-circle fa-2x"} />
        </NavLink>}
    </nav>
  );
};

export default NavBarTop;
