import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import PageLayout from '../_PageLayout';
import './PageHome.css';
import Word from "../../components/Word";
import {IMeaningExample, IMeaningUsage, isAdminOrSuperAdmin, IWord} from 'myprodict-model/lib-esm';
import * as actions from "../../actions";
import MeaningSummary from "../../components/MeaningSummary";
import {IWordState} from "../../reducers/word";
import {IMeaningState} from "../../reducers/meaning";
import {IUserState} from "../../reducers/user";
import {IStoreState} from "../../types";
import {IPronState} from "../../reducers/pronunciation";
import {IMeaningUsageState} from "../../reducers/meaning_usage";
import {IMeaningExampleState} from "../../reducers/meaning_usage_example";
import * as _ from 'lodash';
import CardMeaning from "../../components/CardMeaning/index";
import CardExampleSentence from "../../components/CardExampleSentence";

interface PageHomeProps {
  word: IWordState,
  pron: IPronState,
  meaning: IMeaningState,
  user: IUserState,
  mUsage: IMeaningUsageState,
  mExample: IMeaningExampleState,

  setCurrentWord(keyid: string): any;

  searchWordExamples(term: string): any;
}

interface PageHomeState {
  wordItems: IWord[];
}

class PageHome extends React.Component<PageHomeProps, PageHomeState> {

  constructor(props: PageHomeProps, context: any) {
    super(props, context);
    this.state = {
      wordItems: []
    };
  }

  componentDidMount() {
    this.setupWordItems(this.props.word)
  }

  componentWillReceiveProps(nextProps: PageHomeProps) {
    this.setupWordItems(nextProps.word)
  }

  setupWordItems = (word: IWordState) => {
    const {currentWordKeyid, searchResult} = word;
    // sorting to keep the current word on top of the list
    const words: IWord[] = searchResult.models || [];
    if (words.length > 0) {
      // check if new words fetched
      const wKeyids = words.map(w => w.keyid);
      const {wordItems} = this.state;
      const sKeyids = wordItems.map(w => w.keyid);
      const isNewWords = wKeyids.length !== sKeyids.length || !wKeyids.reduce((prev, k) => prev && sKeyids.indexOf(k) > -1, true);
      if (isNewWords) { // simply set wordItems if new words fetched in props
        this.setState({wordItems: words});
      }
      else if (currentWordKeyid) {  // sorting to put the current Word on top
        const currentWord = _.find(wordItems, {keyid: currentWordKeyid});
        if (currentWord) {
          _.remove(wordItems, {keyid: currentWordKeyid});
          wordItems.reverse();
          wordItems.push(currentWord);
          wordItems.reverse();
          this.setState({wordItems});
        }
      }
    }
  }

  onSelectWord = (keyid: string, word: string) => {
    this.props.setCurrentWord(keyid);
    if (!_.find(this.props.mExample.termExamples, {term: word})) {
      this.props.searchWordExamples(word);
    }
  };

  renderUsages = (wordKeyid: string, usageItems: IMeaningUsage[], exampleItem: IMeaningExample[]) => {
    const usages = _.filter(usageItems, {value: {meaning_keyid: null}});
    return usages.length > 0 ? <CardMeaning
      usages={usages}
      examples={exampleItem}
    /> : null;
  };

  render() {
    const {word, pron, meaning, user, mUsage, mExample} = this.props;

    const {currentWordKeyid} = word;

    const meanings = _.filter(meaning.items, {value: {word_keyid: currentWordKeyid}});
    const usages = _.filter(mUsage.items, {value: {word_keyid: currentWordKeyid}});

    const {wordItems} = this.state;
    const currentWord = _.find(wordItems, {keyid: currentWordKeyid});

    const termExample = currentWord && _.find(mExample.termExamples, {term: currentWord.value.word});

    const isWordEditable = user.auth_isLoggedIn && isAdminOrSuperAdmin(user.role);

    return <PageLayout>
      <div className='page-home'>
        <div className={'row no-gutters'}>
          <div className={'col-sm-5 order-12 order-sm-1'}>
            {wordItems.map((model: IWord) => {
              const meaningNumber = _.filter(meaning.items, {value: {word_keyid: model.keyid}}).length;
              const usageNumber = _.filter(mUsage.items, {value: {word_keyid: model.keyid}}).length;
              const pronItems = _.filter(pron.items, {value: {word_keyid: model.keyid}});
              return <div key={model.keyid} className={'mb-3 word'}>
                <Word
                  word={model}
                  prons={pronItems}
                  isActive={!!currentWordKeyid && currentWordKeyid === model.keyid}
                  meaningNumber={meaningNumber}
                  usageNumber={usageNumber}
                  isEditable={isWordEditable}
                  onSelectWord={this.onSelectWord}
                  link={`/word/${model.value.custom_url}`}
                />
              </div>
            })}
          </div>
          {currentWord &&
          <div className={'col-sm-7 pl-sm-3 order-1 order-sm-12 mb-2 mb-sm-0'}>
            {meanings.length > 0 && <div className={'mb-2'}>
              <MeaningSummary
                word={currentWord.value.word}
                meanings={meanings}/>
            </div>}

            {termExample && termExample.examples.length > 0 && <div className={'mb-2'}>
              <CardExampleSentence
                word={currentWord.value.word}
                wordCustomUrl={currentWord.value.custom_url}
                examples={termExample.examples.slice(0, 3)}
              />
            </div>}

            {/* Usages & Examples of Word without any Meaning */}
            {this.renderUsages(currentWord.keyid, usages, mExample.items)}

            {/* Meaning Usages & Examples */}
            {meanings.length > 0 && meanings.map(m => <div key={m.keyid} className={'mt-3'}>
              <CardMeaning
                meaning={m.value.mean}
                usages={_.filter(usages, {value: {meaning_keyid: m.keyid}})}
                examples={mExample.items}
              />
            </div>)}
          </div>
          }
        </div>
      </div>
    </PageLayout>;
  }
}

const mapStateToProps = (state: IStoreState) => ({
  word: state.word,
  pron: state.pron,
  meaning: state.meaning,
  user: state.user,
  mUsage: state.meaning_usage,
  mExample: state.meaning_usage_example,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setCurrentWord: (wordKeyid: string) => dispatch(actions.setCurrentWord(wordKeyid)),
  searchWordExamples: (term: string) => dispatch(actions.searchExamples(term)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHome);
