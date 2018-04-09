
export const dispatchApiCallAction = (ACTION_NAME: string, asyncAction: any, payloadOfStart?: any) => (dispatch: any) => {

  dispatch({
    type: `${ACTION_NAME}_START`,
    payload: payloadOfStart
  });

  return asyncAction
    .then((asyncResult: any) => {
      dispatch({
        type: `${ACTION_NAME}_DONE`,
        payload: asyncResult,
      });
    })
    .catch((err: any) => {
      dispatch({
        type: `${ACTION_NAME}_FAILED`,
        payload: err,
      });
    });
};
