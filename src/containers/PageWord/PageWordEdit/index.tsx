import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import * as _ from 'lodash';
import {IWord, IPronunciation} from "myprodict-model/lib-esm";
import {match} from "react-router";
import {IStoreState} from '../../../types';
import './PageWordEdit.css';
import {IWordState} from "../../../reducers/word";
import {IPronState} from "../../../reducers/pronunciation";
import CardWordEdit from "../../../components/CardWordEdit";
import * as actions from "../../../actions";
import CardPronunciationEdit from "../../../components/CardPronunciationEdit";
import CardPronunciationAdd from '../../../components/CardPronunciationAdd';

interface PageWordEditProps {
  match: match<any>;
  word: IWordState;
  pron: IPronState;

  fetchWord(keyid_url: string): any;

  checkWordExisting(value: string): any;

  checkWordUrlExisting(value: string): any;

  submitWord(value: any): any;

  deletePron(keyid: string): any;

  submitPron(value: any): any;
}

interface PageWordEditState {
  word?: IWord;
  prons: IPronunciation[];
}

class PageWordEdit extends React.Component<PageWordEditProps, PageWordEditState> {

  constructor(props: PageWordEditProps, context: any) {
    super(props, context);

    this.state = {
      prons: [],
    };

    const {match, word, pron} = props;
    const {keyid_url} = match.params;
    if (word.searchResult && word.searchResult.models && word.searchResult.models.length > 0) {
      const foundWord = word.searchResult.models
        .find((item: IWord) => item.keyid === keyid_url || item.value.custom_url === keyid_url);
      this.state = {
        word: foundWord,
        prons: pron.items && foundWord && pron.items.filter(p => p.value.word_keyid === foundWord.keyid) || [],
      };
    }
  }

  componentDidMount() {
    const {word, match} = this.props;
    const {keyid_url} = match.params;
    const {wordItem} = word;
    if (!wordItem || (wordItem.keyid !== keyid_url && wordItem.keyid !== keyid_url)) {
      // fetch exact word
      this.fetchWord();
    }
  }

  componentWillReceiveProps(nextProps: PageWordEditProps) {
    const {word, pron} = nextProps;
    const {wordItem} = word;
    if (wordItem) {
      const prons = pron.items.filter(p => wordItem.keyid === p.value.word_keyid) || [];
      if (!this.state.word
        || wordItem.keyid === this.state.word.keyid) {
        this.setState({
          word: wordItem,
          prons,
        });
      }
    }
  }

  fetchWord = () => this.props.fetchWord(this.props.match.params.keyid_url);

  render() {

    const {isFetchingWord} = this.props.word;
    const {isSaving, isDeleting, isSearching} = this.props.pron;
    const {word, prons} = this.state;
    const pSystems = _.uniq(prons.map(p => p.value.system));

    const isPronProcessing = isSaving || isDeleting || isSearching;
    const isProcessing = isFetchingWord || isPronProcessing;

    return <div className='page-word-edit'>
      <div className={'form-group text-right'}>
        <button className={'btn btn-outline-secondary'} disabled={isProcessing} onClick={this.fetchWord}>
          {isProcessing && <i className={"fa fa-spinner an-spin"}/>}
          {!isProcessing && <i className={"fa fa-refresh"}/>}
        </button>
      </div>
      <div className={'row'}>
        <div className={'col-12 col-sm-7'}>
          {word &&
          <CardWordEdit
            wordKeyid={word.keyid}
            word={word.value.word}
            customUrl={word.value.custom_url}
            wordStatus={word.value.status}
            isProcessing={isFetchingWord}
            isWordChecking={this.props.word.isWordChecking}
            isWordExisting={this.props.word.isWordExisting}
            isUrlChecking={this.props.word.isUrlChecking}
            isUrlExisting={this.props.word.isUrlExisting}
            onChangeWord={this.props.checkWordExisting}
            onChangeCustomUrl={this.props.checkWordUrlExisting}
            onSubmit={this.props.submitWord}
          />}
        </div>

        <div className={'col-12 col-sm-5'}>
          {word && <div className={'mb-2'}>
            <CardPronunciationAdd
              wKeyid={word.keyid}
              isProcessing={isPronProcessing}
              savePr={this.props.submitPron}/>
          </div>}
          {word && pSystems && pSystems.map(s =>
            <div key={s} className={'mb-3'}>
              <CardPronunciationEdit
                wKeyid={word.keyid}
                word={word.value.word}
                isProcessing={isPronProcessing}
                prons={prons.filter(p => p.value.system === s)}
                deletePr={this.props.deletePron}
                savePr={this.props.submitPron}
              />
            </div>)}
        </div>
      </div>
    </div>;
  }
}

const mapStateToProps = (state: IStoreState) => ({
  word: state.word,
  pron: state.pron,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchWord: (keyid_url: string) => dispatch(actions.fetchWord(keyid_url)),
  checkWordExisting: (value: string) => dispatch(actions.checkWordExisting(value)),
  checkWordUrlExisting: (value: string) => dispatch(actions.checkWordUrlExisting(value)),
  submitWord: (value: any) => dispatch(actions.submitWord(value)),

  deletePron: (keyid: string) => dispatch(actions.deletePron(keyid)),
  submitPron: (value: any) => dispatch(actions.submitPron(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageWordEdit);
