import * as React from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions/';
import './PageWordAdd.css';
import CardWordEdit from "../../../components/CardWordEdit";

interface PageWordAddProps {
  isWordExisting: boolean;
  isWordChecking: boolean;
  isUrlExisting: boolean;
  isUrlChecking: boolean;
  isSaving: boolean;

  checkWordExisting(value: string): any;

  checkWordUrlExisting(value: string): any;

  submitWord(value: any): any;
}

class PageWordAdd extends React.Component<PageWordAddProps, {}> {

  render() {
    // console.log('props = ', this.props);
    return <div className={'page-word-add'}>
      <CardWordEdit
        isWordExisting={this.props.isWordExisting}
        isWordChecking={this.props.isWordChecking}
        isUrlExisting={this.props.isUrlExisting}
        isUrlChecking={this.props.isUrlChecking}
        isProcessing={this.props.isSaving}
        onChangeWord={this.props.checkWordExisting}
        onChangeCustomUrl={this.props.checkWordUrlExisting}
        onSubmit={this.props.submitWord}
      />
    </div>;
  }
}

const mapStateToProps = (state: any) => state.word;

const mapDispatchToProps = (dispatch: any) => ({
  checkWordExisting: (value: string) => dispatch(actions.checkWordExisting(value)),
  checkWordUrlExisting: (value: string) => dispatch(actions.checkWordUrlExisting(value)),
  submitWord: (value: any) => dispatch(actions.submitWord(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageWordAdd);
