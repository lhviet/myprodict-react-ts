import * as React from 'react';
import './MeaningSummary.css';
import {EWClass, getEWordClassString, IMeaning} from 'myprodict-model/lib-esm';

interface MeaningSummaryProps {
  word: string;
  meanings: IMeaning[];
}

interface MeaningSummaryState {
}

class MeaningSummary extends React.Component<MeaningSummaryProps, MeaningSummaryState> {

  constructor(props: MeaningSummaryProps, context: any) {
    super(props, context);
  }

  render() {
    const {word, meanings} = this.props;

    return <div className={'component-meaning-summary card '}>
      <div className={'card-header bg-warning'}>
        mean(s) of <b>{word}</b>
      </div>
      <ul className={'list-group'}>
        {meanings.map(meaning =>
          <li key={meaning.keyid} className={'list-group-item d-flex justify-content-between align-items-center'}>
            {meaning.value.mean}
            {meaning.value.word_class && meaning.value.word_class !== EWClass.all &&
              <span className={'text-info font-italic font-weight-600'}>
                {getEWordClassString(meaning.value.word_class)}
              </span>}
          </li>)}
      </ul>
    </div>;
  }
}

export default MeaningSummary;
