import * as React from 'react';
import {EStatus} from "myprodict-model/lib-esm";

import './ButtonStatus.css';

interface ButtonStatusProps {
  statusNumber?: EStatus;
  onClickStatus?(value: EStatus): void;
}

export default (props: ButtonStatusProps) => {
  const onClickStatus = (status: EStatus) => props.onClickStatus && props.onClickStatus(status);
  return <div className="btn-group btn-group-sm" role="group" aria-label="Status">
    <button
      type="button"
      className={"btn " + (props.statusNumber === EStatus.Pending ? "btn-warning" : "btn-outline-secondary")}
      onClick={() => onClickStatus(EStatus.Pending)}
    >Pending
    </button>
    <button
      type="button"
      className={"btn " + (props.statusNumber === EStatus.Processing ? "btn-info" : "btn-outline-secondary")}
      onClick={() => onClickStatus(EStatus.Processing)}
    >Processing
    </button>
    <button
      type="button"
      className={"btn " + (props.statusNumber === EStatus.Disabled ? "btn-secondary" : "btn-outline-secondary")}
      onClick={() => onClickStatus(EStatus.Disabled)}
    >Disabled
    </button>
    <button
      type="button"
      className={"btn " + (props.statusNumber === EStatus.Active ? "btn-primary" : "btn-outline-secondary")}
      onClick={() => onClickStatus(EStatus.Active)}
    >Active
    </button>
    <button
      type="button"
      className={"btn " + (props.statusNumber === EStatus.Rejected ? "btn-danger" : "btn-outline-secondary")}
      onClick={() => onClickStatus(EStatus.Rejected)}
    >Rejected
    </button>
  </div>;
}
