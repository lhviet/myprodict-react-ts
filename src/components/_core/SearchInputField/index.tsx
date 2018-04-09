import * as React from 'react';
import './SearchInputField.css';
import {IWord} from "myprodict-model/lib-esm";
import {Link} from "react-router-dom";

interface SearchInputFieldProps {
  value?: string;
  isSearching?: boolean;
  isResultListDisplay?: boolean; // enable result list to display or not
  onChange?(value: string): void;

  items: IWord[];
}

interface SearchInputFieldState {
  value: string;
  isFocusing: boolean;
}

class SearchInputField extends React.Component<SearchInputFieldProps, SearchInputFieldState> {

  constructor(props: SearchInputFieldProps, context: any) {
    super(props, context);
    this.state = {
      value: this.props.value || '',
      isFocusing: false
    };
  }

  onChangeValue = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({value: e.currentTarget.value});
    if (this.props.onChange)
      this.props.onChange(e.currentTarget.value);
  }

  setFocus = (isFocusing: boolean) => this.setState({isFocusing});

  render() {
    return (
      <div className="search-input-field pos-r">
        <div className="pos-r">
          <input
            type="text"
            className="form-control"
            placeholder="Search here..."
            aria-label="search keywords"
            value={this.state.value}
            onChange={this.onChangeValue}
            onFocus={() => this.setFocus(true)}
          />
          <div className="input-search-icon" onClick={() => this.props.onChange && this.props.onChange(this.state.value)}>
            <i className={`fa ${this.props.isSearching ? 'fa-spinner an-spin' : 'fa-search'}`}/>
          </div>
        </div>
        {this.props.isResultListDisplay && this.state.isFocusing && this.props.items && this.props.items.length > 0 &&
        <div className={'pos-a w-100'} style={{zIndex: 120}}>
          <div className={'search-backdrop'} onClick={() => this.setFocus(false)}/>
          <ul className="list-group">
            {this.props.items.map((model: any, index: number) =>
              <Link key={model.keyid + index}
                    to={`/word/${model.value.custom_url}`}
                    className={'list-group-item a-muted'}>
                {model.value.word}
              </Link>
            )}
          </ul>
        </div>}
      </div>
    );
  }
}

export default SearchInputField;
