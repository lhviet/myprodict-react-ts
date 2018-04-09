import * as React from 'react';
import './CardPronunciationAdd.css';
import {
  BModel, getEPLocalMap, getEPLocalString, getEPSystemMap, getEPSystemString,
  getEWClassMap,
  getEWordClassString,
  IPronunciationValue,
} from 'myprodict-model/lib-esm';

interface CardPronunciationAddProps {
  wKeyid: string;
  isProcessing: boolean;
  savePr?(pr: {value: IPronunciationValue}): any;
}

interface CardPronunciationAddState {
  pronValue: IPronunciationValue;
}

class CardPronunciationAdd extends React.Component<CardPronunciationAddProps, CardPronunciationAddState> {

  constructor(props: CardPronunciationAddProps, context: any) {
    super(props, context);
    this.state = {
      pronValue: {
        ...BModel.initPronunciation(),
        word_keyid: props.wKeyid,
      },
    }
  }

  handlePronunciationChange = (value: string) => {
    this.setState({
      pronValue: {
        ...this.state.pronValue,
        transcript: value,
      }
    });
  };

  handlePSystemChange = (value: string) => {
    try {
      const system = parseInt(value, 10);
      this.setState({
        pronValue: {
          ...this.state.pronValue,
          system,
        }
      });
    } catch (err) {
      console.error('change pronunciation system ERROR = ', err.message);
    }
  };

  handlePLocalChange = (value: string) => {
    try {
      const local = parseInt(value, 10);
      this.setState({
        pronValue: {
          ...this.state.pronValue,
          local,
        }
      });
    } catch (err) {
      console.error('change pronunciation local ERROR = ', err.message);
    }
  };

  handleWClassChange = (value: string) => {
    try {
      const word_class = parseInt(value, 10);
      this.setState({
        pronValue: {
          ...this.state.pronValue,
          word_class,
        }
      });
    } catch (err) {
      console.error('change pronunciation class ERROR = ', err.message);
    }
  };

  handleDescriptionChange = (value: string) => {
    this.setState({
      pronValue: {
        ...this.state.pronValue,
        description: value,
      }
    });
  };

  handleSoundUrlChange = (value: string) => {
    this.setState({
      pronValue: {
        ...this.state.pronValue,
        sound_url: value,
      }
    });
  };

  savePr = () => {
    const {pronValue} = this.state;
    if (!this.props.savePr || !pronValue.transcript) {
      return;
    }
    this.props.savePr({value: {...this.state.pronValue}});
  }

  render() {
    const {pronValue} = this.state;
    const {isProcessing} = this.props;

    return <div className={'card card-pronunciation-add'}>
      <div className="card-header">
        {pronValue.word_keyid}
        <button className={"btn btn-sm btn-outline-primary ml-2 float-right"} disabled={isProcessing} onClick={this.savePr}>
          <i className={'fa fa-save cursor-p'}/>
        </button>
      </div>
      <div className="card-body">
        <table className={"table table-sm border-0 mb-0"}>
          <tbody>
          <tr>
            <td className={'text-muted fs-d8e ml-3 border-0'}>
              <select className="form-control" value={pronValue.system}
                      onChange={e => this.handlePSystemChange(e.target.value)}>
                {getEPSystemMap().map(s =>
                  <option key={s} value={s}>{getEPSystemString(s)}</option>)}
              </select>
            </td>

            <td className={'text-muted fs-d8e ml-3 border-0'}>
              <select className="form-control" value={pronValue.local}
                      onChange={e => this.handlePLocalChange(e.target.value)}>
                {getEPLocalMap().map(l =>
                  <option key={l} value={l}>{getEPLocalString(l)}</option>)}
              </select>
            </td>

            <td className={'text-muted fs-d8e ml-3 border-0'}>
              <select className="form-control" value={pronValue.word_class}
                      onChange={e => this.handleWClassChange(e.target.value)}>
                {getEWClassMap().map(e =>
                  <option key={e} value={e}>{getEWordClassString(e)}</option>)}
              </select>
            </td>
          </tr>

          <tr>
            <td className={'align-middle border-0'} colSpan={3}>
              <input value={pronValue.transcript} className={'form-control'}
                     onChange={e => this.handlePronunciationChange(e.target.value)} />
            </td>
          </tr>

          <tr>
            <td className={'align-middle border-0'} colSpan={3}>
              <input value={pronValue.description || ''} className={'form-control'} placeholder="description..."
                     onChange={e => this.handleDescriptionChange(e.target.value)} />
            </td>
          </tr>

          <tr>
            <td className={'align-middle border-0'} colSpan={3}>
              <input type="url"
                     value={pronValue.sound_url || ''}
                     className={'form-control'}
                     placeholder="sound url..."
                     onChange={e => this.handleSoundUrlChange(e.target.value)} />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>;
  }
}

export default CardPronunciationAdd;
