import * as React from 'react';
import './CardMeaning.css';
import {getEWordClassString, IMeaningExample, IMeaningUsage} from 'myprodict-model/lib-esm';
import * as _ from 'lodash';

interface CardMeaningProps {
  meaning?: string;
  usages: IMeaningUsage[];
  examples: IMeaningExample[];  // all examples of usages
}

interface CardMeaningState {
}

class CardMeaning extends React.Component<CardMeaningProps, CardMeaningState> {

  constructor(props: CardMeaningProps, context: any) {
    super(props, context);
  }

  render() {
    const {meaning, usages, examples} = this.props;

    // processing usages: grouping by value.usage & sorting
    const usageSubjs = _.uniq(_.map(usages, 'value.usage'));
    usageSubjs.sort((a: string, b: string) => a.length - b.length);

    return <div className={'component-card-meaning card '}>
      {meaning && <h5 className={'card-header text-primary'}>{meaning}</h5>}
        <div className={'card-body'}>
          {usageSubjs.map((uSubj, index) => <div key={index} className={'mb-3 pb-2 border-bottom'}>
              <div className={'text-muted'}>{uSubj}</div>
            {_.filter(usages, {value: {usage: uSubj}})
              .map(u => <div key={u.keyid} className={'pl-2 m-explanation'}>
                <div className={'pos-r'}>
                  {u.value.explanation}
                  <div className={'text-muted fs-d8e float-right font-italic'}>{getEWordClassString(u.value.word_class)}</div>
                </div>
                {_.filter(examples, {value: {meaning_usage_keyid: u.keyid}})
                  .map(ex => <div key={ex.keyid} className={'text-muted font-italic pl-3'}>
                    - {ex.value.sentence}
                    </div> )}
                </div> )}
            </div>)}
        </div>
    </div>;
  }
}

export default CardMeaning;
