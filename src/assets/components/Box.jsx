import { useContext } from 'react';
import classes from './Box.module.css';
import Piece from './Piece';
import BoardContext from '../state/board-context';
import {
  howMuchMovesDoesEnemyHaveAfterThisMove,
  isEnemyKingChecked,
} from '../functions/helper-functions';

const Box = (props) => {
  const boardCtx = useContext(BoardContext);
  const indexInContext = boardCtx.items.findIndex(
    (item) => props.column === item.column && props.row === item.row
  );
  const isWhite = (props.column + props.row) % 2 === 0;

  const isSelected = () => {
    if (boardCtx.select)
      return (
        boardCtx.select.findIndex(
          (data) => data.column === props.column && data.row === props.row
        ) !== -1
      );
  };

  const style = `${classes.box} ${isSelected() ? classes.available : ''}`;

  const onClickHandler = () => {
    if (isSelected()) {
      const [
        selectedPieceColor,
        selectedPieceFigure,
        startingColumn,
        startingRow,
      ] = boardCtx.selectedPiece;
      const isPromotion =
        selectedPieceFigure === 'pawn' && (props.row === 8 || props.row === 1);
      const selectData = boardCtx.select.find(
        (field) => field.column === props.column && field.row === props.row
      );
      let legalEnemyMoves = selectData.enemyOptions;
      let checkCheck = selectData.check;
      if (indexInContext !== -1) {
        boardCtx.removePiece(props.column, props.row);
      }
      boardCtx.removePiece(startingColumn, startingRow);
      boardCtx.addPiece(
        selectedPieceFigure,
        selectedPieceColor,
        props.column,
        props.row
      );
      if (
        selectedPieceFigure === 'king' &&
        Math.abs(props.column - startingColumn) === 2
      ) {
        const rookStartingColumn = props.column === 3 ? 1 : 8;
        const rookFinalColumn = props.column === 3 ? 4 : 6;
        legalEnemyMoves = howMuchMovesDoesEnemyHaveAfterThisMove(
          rookFinalColumn,
          props.row,
          [...boardCtx.items],
          rookStartingColumn,
          props.row,
          selectedPieceColor,
          'rook'
        );
        checkCheck = isEnemyKingChecked(
          rookFinalColumn,
          props.row,
          [...boardCtx.items],
          rookStartingColumn,
          props.row,
          selectedPieceColor,
          'rook'
        );
        boardCtx.removePiece(rookStartingColumn, props.row);
        boardCtx.addPiece(
          'rook',
          selectedPieceColor,
          rookFinalColumn,
          props.row
        );
      }
      if (selectedPieceFigure === 'pawn' && startingColumn !== props.column) {
        const isAttackedFieldTaken = boardCtx.items.find(
          (item) => item.column === props.column && item.row === props.row
        );
        !isAttackedFieldTaken &&
          boardCtx.removePiece(
            boardCtx.moves[boardCtx.moves.length - 1].finish.column,
            boardCtx.moves[boardCtx.moves.length - 1].finish.row
          );
      }
      if (isPromotion) {
        boardCtx.promotionPopUp(
          selectedPieceColor,
          startingColumn,
          startingRow,
          props.column,
          props.row
        );
      } else {
        boardCtx.addMove(
          {
            color: selectedPieceColor,
            figure: selectedPieceFigure,
          },
          { column: startingColumn, row: startingRow },
          { column: props.column, row: props.row },
          checkCheck,
          isPromotion
        );
        if (legalEnemyMoves === 0) {
          checkCheck === false
            ? boardCtx.endGame('stalemate')
            : boardCtx.endGame(boardCtx.player);
        }
        boardCtx.selectBoxes();
        boardCtx.endTurn();
      }
    }
  };

  return (
    <div
      className={style}
      style={{ backgroundColor: `${!isWhite && 'black'}` }}
      onClick={onClickHandler}
    >
      {indexInContext !== -1 && (
        <Piece
          color={boardCtx.items[indexInContext].piece.color}
          figure={boardCtx.items[indexInContext].piece.figure}
          coords={props}
        />
      )}
    </div>
  );
};

export default Box;
