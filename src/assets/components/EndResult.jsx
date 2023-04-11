import classes from './EndResult.module.css';
import { useContext } from 'react';
import BoardContext from '../state/board-context';

function EndResult() {
  const boardCtx = useContext(BoardContext);
  const winner = boardCtx.winner.toUpperCase();

  const onClickHandler = () => {
    boardCtx.restart();
  };

  return (
    <div className={classes.endresult}>
      <p>
        {winner === 'STALEMATE'
          ? 'STALEMATE! SOMETIMES NOONE WINS!'
          : `GAME OVER! ${winner} PLAYER WON!`}
      </p>
      <button onClick={onClickHandler}>PLAY AGAIN!</button>
    </div>
  );
}

export default EndResult;
