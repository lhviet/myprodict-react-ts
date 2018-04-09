import * as React from 'react';
import './CardWordEdit.css';
import ButtonStatus from "../_core/btns/ButtonStatus";
import {EStatus} from "myprodict-model/lib-esm";
import {Subject} from "rxjs/Subject";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

interface CardWordEditProps {
  wordKeyid?: string;
  word?: string;
  customUrl?: string;
  wordStatus?: EStatus;

  isWordExisting?: boolean;
  isWordChecking?: boolean;
  isUrlExisting?: boolean;
  isUrlChecking?: boolean;
  isProcessing?: boolean;

  onChangeWord?(value: string): any;
  onChangeCustomUrl?(value: string): any;
  onSubmit?(value: any): any;
}

interface CardWordEditState {
  word: string;
  customUrl: string;
  wordStatus: EStatus;
}

class CardWordEdit extends React.Component<CardWordEditProps, CardWordEditState> {

  subjectWord$: Subject<string>;
  subjectWordUrl$: Subject<string>;

  constructor(props: CardWordEditProps, context: any) {
    super(props, context);
    this.state = {
      word: this.props.word || '',
      customUrl: this.props.customUrl || '',
      wordStatus: this.props.wordStatus || 1
    };
  }

  componentDidMount() {

    // subscribe to it just like an Observable
    if (this.props.onChangeWord) {
      this.subjectWord$ = new Subject();
      this.subjectWord$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(this.props.onChangeWord),  // switch to new observable each time the term changes
        )
        .subscribe();
    }


    // subscribe to it just like an Observable
    if (this.props.onChangeCustomUrl) {
      this.subjectWordUrl$ = new Subject();
      this.subjectWordUrl$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(this.props.onChangeCustomUrl),  // switch to new observable each time the term changes
        )
        .subscribe();
    }
  }

  componentWillUnmount() {
    if (this.subjectWord$) {
      this.subjectWord$.unsubscribe();
    }
    if (this.subjectWordUrl$) {
      this.subjectWordUrl$.unsubscribe();
    }
  }

  onChangeWord = (value: string) => {
    this.setState({word: value});
    if (this.subjectWord$) {
      this.subjectWord$.next(value);
    }
  };

  onChangeCustomUrl = (value: string) => {
    this.setState({customUrl: value});
    if (this.subjectWordUrl$) {
      this.subjectWordUrl$.next(value);
    }
  };

  onClickReset = () => this.setState({
    word: this.props.word || '',
    customUrl: this.props.customUrl || '',
    wordStatus: this.props.wordStatus || 1
  });

  onClickSubmit = () => this.props.onSubmit && this.props.onSubmit({
    keyid: this.props.wordKeyid,
    value: {
      word: this.state.word,
      custom_url: this.state.customUrl,
      status: this.state.wordStatus
    }
  });

  onStatusUpdate = (wordStatus: EStatus) => this.setState({wordStatus});

  getWordCheckingClass = () => {
    let resClass = 'fa-check text-success';
    if (this.props.isWordExisting) {
      if (!this.props.wordKeyid
        || this.props.word && this.props.word.trim() !== this.state.word.trim()) {
        resClass = 'fa-exclamation-triangle text-warning';
      }
    }
    return resClass;
  };
  getUrlCheckingClass = () => {
    let resClass = 'fa-check text-success';
    if (this.props.isUrlExisting) {
      if (!this.props.wordKeyid
        || this.props.customUrl && this.props.customUrl.trim() !== this.state.customUrl.trim()) {
        resClass = 'fa-exclamation-triangle text-warning';
      }
    }
    return resClass;
  };

  render() {
    return <div className="card">
      <div className="card-header d-flex justify-content-between">
        <div className={"font-weight-700"}>{this.props.wordKeyid || 'Dictionary Word'}</div>
      </div>
      <div className="card-body">
        <div className={'form-group'}>
          <label>Word</label>
          <div className={'position-relative'}>
            <input
              type="text"
              className={'form-control'}
              value={this.state.word}
              onChange={e => this.onChangeWord(e.target.value)} />
            <i
              className={`fa ${this.props.isWordChecking ? 'fa-spinner an-spin' : this.getWordCheckingClass()} position-absolute r-d5 t-0`}
              style={{top: '.7em'}}/>
          </div>
        </div>
        <div className={'form-group'}>
          <label>Custom Url</label>
          <div className={'position-relative'}>
            <input
              type="text"
              className={'form-control'}
              value={this.state.customUrl}
              onChange={e => this.onChangeCustomUrl(e.target.value)}
            />
            <i
              className={`fa ${this.props.isUrlChecking ? 'fa-spinner an-spin' : this.getUrlCheckingClass()} position-absolute r-d5 t-0`}
              style={{top: '.7em'}}/>
          </div>
        </div>
        <div className={'form-group d-flex justify-content-between'}>
          <label>Status</label>
          <ButtonStatus
            statusNumber={this.state.wordStatus}
            onClickStatus={this.onStatusUpdate}
          />
        </div>
      </div>
      <div className="card-footer text-right">
        <button className={'btn btn-outline-danger mr-3'} onClick={this.onClickReset} disabled={this.props.isProcessing}>Reset</button>
        <button className={'btn btn-primary'} onClick={this.onClickSubmit} disabled={this.props.isProcessing}>Submit</button>
      </div>
    </div>;
  }
}

export default CardWordEdit;
