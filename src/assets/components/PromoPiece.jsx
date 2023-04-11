import classes from './PromoPiece.module.css';
import { useContext } from 'react';
import BoardContext from '../state/board-context';
import {
  howMuchMovesDoesEnemyHaveAfterThisMove,
  isEnemyKingChecked,
} from '../functions/helper-functions';

function PromoPiece(props) {
  const boardCtx = useContext(BoardContext);
  const { color, column, row } = boardCtx.promotion;
  const style = `${classes.promopiece} ${classes[props.name]} ${
    classes[color]
  }`;

  const onClickHandler = () => {
    boardCtx.removePiece(column, row);
    boardCtx.addPiece(props.name, color, column, row);
    boardCtx.endPromotion(props.name);
    const legalEnemyMoves = howMuchMovesDoesEnemyHaveAfterThisMove(
      column,
      row,
      [...boardCtx.items],
      column,
      row,
      color,
      props.name
    );
    const checkCheck = isEnemyKingChecked(
      column,
      row,
      [...boardCtx.items],
      column,
      row,
      color,
      props.name
    );
    boardCtx.addMove(
      {
        color: color,
        figure: 'pawn',
      },
      {
        column: boardCtx.promotion.initialColumn,
        row: boardCtx.promotion.initialRow,
      },
      { column: column, row: row },
      checkCheck,
      props.name
    );
    if (legalEnemyMoves === 0) {
      checkCheck === false
        ? boardCtx.endGame('stalemate')
        : boardCtx.endGame(boardCtx.player);
    }
    boardCtx.selectBoxes();
    boardCtx.endTurn();
  };

  return (
    <div className={style} onClick={onClickHandler}>
      {props.name.toUpperCase()}
    </div>
  );
}

export default PromoPiece;
