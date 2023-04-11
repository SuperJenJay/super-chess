import classes from './Turn.module.css';
import { useContext } from 'react';
import BoardContext from '../state/board-context';

function Turn() {
  const boardCtx = useContext(BoardContext);
  return (
    <div className={classes.indicator}>
      <div className={classes.turn}>
        <p className={classes.para}>CURRENT PLAYER:</p>
        {boardCtx.player.toUpperCase()}
      </div>
      <div className={classes.check}>{boardCtx.check && 'CHECK!'}</div>
    </div>
  );
}

export default Turn;
