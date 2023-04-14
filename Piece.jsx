import { useContext } from 'react';
import classes from './Piece.module.css';
import BoardContext from '../state/board-context';
import {
  availableMoves,
  isKingSafeAfterThisMove,
  isEnemyKingChecked,
  howMuchMovesDoesEnemyHaveAfterThisMove,
  canPerformCastling,
  enemyColor,
} from '../functions/helper-functions';

const Piece = (props) => {
  const boardCtx = useContext(BoardContext);
  const { column, row } = props.coords;
  const { color, figure } = props;
  const style = `${classes.piece} ${classes[enemyColor(color)]} ${
    classes[props.figure]
  }`;

  const onClickHandler = () => {
    if (boardCtx.select) {
      boardCtx.selectBoxes();
      return;
    }
    if (color !== boardCtx.player) {
      return;
    }
    const available = availableMoves(
      figure,
      column,
      row,
      color,
      boardCtx.items
    );
    const filteredMoves = available.filter((move) =>
      isKingSafeAfterThisMove(
        move.column,
        move.row,
        [...boardCtx.items],
        column,
        row,
        color,
        figure
      )
    );
    if (filteredMoves.length === 0) {
      return;
    }
    if (figure === 'king') {
      const rowColorIndex = color === 'white' ? 8 : 1;
      canPerformCastling(
        boardCtx.moves,
        color,
        'left',
        boardCtx.items,
        boardCtx.check
      ) && filteredMoves.push({ column: 3, row: rowColorIndex });
      canPerformCastling(
        boardCtx.moves,
        color,
        'right',
        boardCtx.items,
        boardCtx.check
      ) && filteredMoves.push({ column: 7, row: rowColorIndex });
    }
    const enPassantRowIndex = color === 'white' ? 4 : 5;
    const previousMove = boardCtx.moves[boardCtx.moves.length - 1];
    if (
      figure === 'pawn' &&
      row === enPassantRowIndex &&
      previousMove.piece.figure === 'pawn' &&
      Math.abs(previousMove.start.row - previousMove.finish.row) === 2 &&
      Math.abs(column - previousMove.finish.column) === 1
    ) {
      const direction = color === 'white' ? -1 : 1;
      filteredMoves.push({
        column: previousMove.finish.column,
        row: row + direction,
      });
    }
    const finalMoves = filteredMoves.map((move) => {
      return {
        ...move,
        check: isEnemyKingChecked(
          move.column,
          move.row,
          [...boardCtx.items],
          column,
          row,
          color,
          figure
        ),
        enemyOptions: howMuchMovesDoesEnemyHaveAfterThisMove(
          move.column,
          move.row,
          [...boardCtx.items],
          column,
          row,
          color,
          figure
        ),
      };
    });
    boardCtx.selectBoxes(finalMoves, color, figure, column, row);
  };

  return (
    <img
      onClick={onClickHandler}
      className={style}
      alt="icon"
      src={`/public/icons/${color}_${figure}.svg`}
    />
  );
};

export default Piece;
