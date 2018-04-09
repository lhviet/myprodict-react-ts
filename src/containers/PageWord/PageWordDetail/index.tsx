import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import PageLayout from '../../_PageLayout';
import { IStoreState } from '../../../types';
import {match} from "react-router";
import {IMeaningExampleState} from "../../../reducers/meaning_usage_example";
import {IMeaningUsageState} from "../../../reducers/meaning_usage";
import {IMeaningState} from "../../../reducers/meaning";
import {IUserState} from "../../../reducers/user";
import {IWordState} from "../../../reducers/word";
import {IPronState} from "../../../reducers/pronunciation";
import {IMeaning, IMeaningExample, IMeaningUsage, isAdminOrSuperAdmin, IWord} from "myprodict-model/lib-esm";
import * as _ from "lodash";
import CardMeaning from "../../../components/CardMeaning";
import Word from "../../../components/Word";
import MeaningSummary from "../../../components/MeaningSummary";
import * as actions from "../../../actions";
import './PageWordDetail.css';
import {scrollBodyTop} from "../../../utils/browser-client-script-util";
import {ITermExample} from "../../../interfaces";
import CardExampleSentence from "../../../components/CardExampleSentence";

interface PageWordDetailProps {
  match: match<any>;
  word: IWordState;
  pron: IPronState;
  meaning: IMeaningState;
  user: IUserState;
  mUsage: IMeaningUsageState;
  mExample: IMeaningExampleState;
  fetchWord(keyid_url: string): any;
}
interface PageWordDetailState {
  meanings: IMeaning[];
  usages: IMeaningUsage[];
  examples: IMeaningExample[];
  pronItems: any[];
  wordItem?: IWord;
  termExample?: ITermExample;
}
class PageWordDetail extends React.Component<PageWordDetailProps, PageWordDetailState> {

  constructor(props: PageWordDetailProps, context: any) {
    super(props, context);
    this.state = {
      meanings: [],
      usages: [],
      examples: [],
      pronItems: [],
    };
  }

  componentDidMount() {
    const {match, word, meaning, mUsage, mExample, pron} = this.props;
    const {keyid_url} = match.params;
    // try to load from local data first before re-fetching new data
    const {currentWordKeyid, searchResult} = word;
    const wordItem = _.find(searchResult.models, {keyid: currentWordKeyid});
    if (wordItem && (wordItem.value.custom_url === keyid_url || wordItem.keyid === keyid_url)) {
      const meanings = _.filter(meaning.items, {value: {word_keyid: wordItem.keyid}});
      const usages = _.filter(mUsage.items, {value: {word_keyid: wordItem.keyid}});
      const pronItems = _.filter(pron.items, {value: {word_keyid: wordItem.keyid}});
      const termExample = _.find(mExample.termExamples, {term: wordItem.value.word});
      this.setState({
        wordItem,
        meanings,
        usages,
        examples: mExample.items,
        pronItems,
        termExample,
      });
    }
    // fetching correct & latest data
    this.props.fetchWord(keyid_url);

    // browser client
    scrollBodyTop();
  }

  componentWillReceiveProps(nextProps: PageWordDetailProps) {
    const {word, meaning, mUsage, mExample, pron} = this.props;
    const {wordItem} = word;
    if (wordItem) {
      const meanings = _.filter(meaning.items, {value: {word_keyid: wordItem.keyid}});
      const usages = _.filter(mUsage.items, {value: {word_keyid: wordItem.keyid}});
      const pronItems = _.filter(pron.items, {value: {word_keyid: wordItem.keyid}});
      const termExample = _.find(mExample.termExamples, {term: wordItem.value.word});
      this.setState({
        wordItem,
        meanings,
        usages,
        examples: mExample.items,
        pronItems,
        termExample,
      });
    }
  }

  renderUsages = (wordKeyid: string, usageItems: IMeaningUsage[], exampleItem: IMeaningExample[]) => {
    const usages = _.filter(usageItems, {value: {meaning_keyid: null}});
    return usages.length > 0 ? <CardMeaning
      usages={usages}
      examples={exampleItem}
    /> : null;
  };

  render() {
    const {user} = this.props;

    const {wordItem, meanings, usages, examples, pronItems, termExample} = this.state;
    let meaningNumber = meanings.length,
      usageNumber = usages.length;

    const isWordEditable = user.auth_isLoggedIn && isAdminOrSuperAdmin(user.role);

    return <PageLayout>
      <div className='page-word-detail'>
        <div className={'row no-gutters'}>
          <div className={'col-sm-5 mb-3'}>
            {wordItem && <Word
              word={wordItem}
              prons={pronItems}
              meaningNumber={meaningNumber}
              usageNumber={usageNumber}
              isEditable={isWordEditable}
            />}
            {wordItem && termExample && termExample.examples.length > 0 && <div className={'mt-3'}>
              <CardExampleSentence
                word={wordItem.value.word}
                examples={termExample.examples}
              />
            </div>}
          </div>
          <div className={'col-sm-7 pl-sm-3'}>
            {wordItem && <div className={''}>
              {meanings.length > 0 && <div className={'mb-2'}>
                <MeaningSummary
                  word={wordItem.value.word}
                  meanings={meanings}/>
              </div>}

              {/* Usages & Examples of Word without any Meaning */}
              {this.renderUsages(wordItem.keyid, usages, examples)}

              {/* Meaning Usages & Examples */}
              {meanings.length > 0 && meanings.map(m => <div key={m.keyid} className={'mt-3'}>
                <CardMeaning
                  meaning={m.value.mean}
                  usages={_.filter(usages, {value: {meaning_keyid: m.keyid}})}
                  examples={examples}
                />
              </div>)}
            </div>}
          </div>
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
  fetchWord: (keyid_url: string) => dispatch(actions.fetchWord(keyid_url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageWordDetail);
