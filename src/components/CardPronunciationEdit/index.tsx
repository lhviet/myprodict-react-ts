import * as React from 'react';
import * as _ from 'lodash';
import './CardPronunciationEdit.css';
import {
  getEPLocalString, getEPSystemString, getEWClassMap, getEWordClassString, IPronunciation,
} from 'myprodict-model/lib-esm';

interface CardPronunciationEditProps {
  wKeyid: string; // word's keyid
  word: string;
  isProcessing: boolean;
  prons: IPronunciation[];
  deletePr?(keyid: string): any;
  savePr?(pr: IPronunciation): any;
}

interface CardPronunciationEditState {
  isLoadingAudio: boolean;
  prons: IPronunciation[];
}

class CardPronunciationEdit extends React.Component<CardPronunciationEditProps, CardPronunciationEditState> {

  constructor(props: CardPronunciationEditProps, context: any) {
    super(props, context);
    this.state = {
      isLoadingAudio: false,
      prons: props.prons,
    };
  }

  componentWillReceiveProps(nextProps: CardPronunciationEditProps) {
    this.setState({prons: nextProps.prons});
  }

  onClickSpeaker = (e: React.SyntheticEvent<HTMLElement>, word: string, local: string) => {
    e.stopPropagation();
    this.setState({isLoadingAudio: true});
    const url = `https://ssl.gstatic.com/dictionary/static/sounds/20160317/${word}--_${local.toLowerCase()}_1.mp3`;
    new Audio(url).play()
      .then(() => {
        this.setState({isLoadingAudio: false});
      })
      .catch(err => {
        const msg = new SpeechSynthesisUtterance();
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(voice => voice.lang === `en-${local.toUpperCase()}`) || voices[0];
        console.error('voice = ', voice);
        msg.voice = voice;
        msg.text = word;
        speechSynthesis.speak(msg);
        this.setState({isLoadingAudio: false});
      });
  };

  handlePronunciationChange = (keyid: string, value: string) => {
    const pron = this.state.prons.find(p => p.keyid === keyid);
    if (pron) {
      pron.value.transcript = value;
      this.setState(this.state);
    }
  };

  handleWClassChange = (keyid: string, value: string) => {
    try {
      const wordClass = parseInt(value, 10);
      const pron = this.state.prons.find(p => p.keyid === keyid);
      if (pron) {
        pron.value.word_class = wordClass;
        this.setState(this.state);
      }
    } catch (err) {
      console.error('change pronunciation class ERROR = ', err.message);
    }
  };

  handleDescriptionChange = (keyid: string, value: string) => {
    const pron = this.state.prons.find(p => p.keyid === keyid);
    if (pron) {
      pron.value.description = value;
      this.setState(this.state);
    }
  };

  handleSoundUrlChange = (keyid: string, value: string) => {
    const pron = this.state.prons.find(p => p.keyid === keyid);
    if (pron) {
      pron.value.sound_url = value;
      this.setState(this.state);
    }
  };

  deletePr = (keyid: string) => this.props.deletePr && this.props.deletePr(keyid);

  savePr = (keyid: string) => {
    if (!this.props.savePr) {
      return;
    }
    const pron = this.state.prons.find(p => p.keyid === keyid);
    if (pron) {
      this.props.savePr(pron);
    }
  }

  render() {
    const {word, isProcessing} = this.props;
    const {prons} = this.state;

    if (prons.length === 0) {
      return <div className={'card card-body'}>{'No Pronunciations'}</div>
    }

    const locals = _.uniq(prons.map(p => p.value.local));
    return <div className={'card card-pronunciation-edit'}>
      <div className="card-header">{getEPSystemString(prons[0].value.system)}</div>
      <div className="card-body">
        {locals.map(local => {
          const wLocal = getEPLocalString(local);
          const localProns = prons.filter(p => p.value.local === local);
          return <div key={local} className={'form-group'}>
            <div className={'font-weight-700'}>{wLocal}</div>
            {localProns.map(item =>
              <table key={item.keyid} className={"table table-sm border-0 mb-0"}>
                <tbody>
                <tr>
                  <td className={'align-middle pr-keyid'} rowSpan={2}>
                    <i className={'fa fa-trash text-danger mr-2 cursor-p'} onClick={() => this.deletePr(item.keyid)}/>
                    {item.keyid}
                  </td>
                  <td>
                    <input value={item.value.transcript} className={'form-control'}
                           onChange={e => this.handlePronunciationChange(item.keyid, e.target.value)} />
                  </td>
                  <td className={'text-muted fs-d8e ml-3'}>
                    <select className="form-control" value={item.value.word_class}
                            onChange={e => this.handleWClassChange(item.keyid, e.target.value)}>
                      {getEWClassMap().map(e =>
                        <option key={e} value={e}>{getEWordClassString(e)}</option>)}
                    </select>
                  </td>
                  <td className={'text-right align-middle text-right'}>
                    <button className={"btn btn-sm btn-outline-primary ml-2"} disabled={isProcessing} onClick={() => this.savePr(item.keyid)}>
                      <i className={'fa fa-save cursor-p'}/>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className={'align-middle border-0'} colSpan={3}>
                    <input value={item.value.description || ''} className={'form-control'} placeholder="description..."
                           onChange={e => this.handleDescriptionChange(item.keyid, e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className={'align-middle border-0'}>
                    <i className={'fa text-muted cursor-p' + (this.state.isLoadingAudio ? ' an-spin fa-spinner' : ' fa-volume-up')}
                      onClick={e => this.onClickSpeaker(e, word, wLocal)}/>
                  </td>
                  <td className={'align-middle border-0'} colSpan={3}>
                    <input type="url"
                           value={item.value.sound_url || ''}
                           className={'form-control'}
                           placeholder="sound url..."
                           onChange={e => this.handleSoundUrlChange(item.keyid, e.target.value)} />
                  </td>
                </tr>
                </tbody>
              </table>)}
          </div>
        })}
      </div>
    </div>;
  }
}

export default CardPronunciationEdit;
