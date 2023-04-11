import { Fragment, useContext } from 'react';
import EndResult from './EndResult';
import Overlay from './Overlay';
import BoardContext from '../state/board-context';
import Promotion from './Promotion';

function SpecialEvent() {
  const boardCtx = useContext(BoardContext);
  return (
    (boardCtx.winner && (
      <Fragment>
        <Overlay />
        <EndResult />
      </Fragment>
    )) ||
    (boardCtx.promotion && (
      <Fragment>
        <Overlay />
        <Promotion />
      </Fragment>
    ))
  );
}

export default SpecialEvent;
