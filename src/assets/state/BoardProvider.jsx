import BoardContext from './board-context';
import { useReducer } from 'react';
import defaultBoardState from './defaultBoardState';

const boardReducer = (state, action) => {
  if (action.type === 'highlight') {
    return {
      ...state,
      select: action.select,
      selectedPiece: action.piece,
    };
  } else if (action.type === 'add') {
    const newItem = {
      column: action.column,
      row: action.row,
      piece: { color: action.color, figure: action.figure },
    };
    return {
      ...state,
      items: [...state.items, newItem],
    };
  } else if (action.type === 'remove') {
    const newItems = state.items.filter(
      (item) => !(item.column === action.column && item.row === action.row)
    );
    return { ...state, items: newItems };
  } else if (action.type === 'move') {
    const newMove = {
      piece: action.piece,
      start: action.start,
      finish: action.finish,
      check: action.check,
      promotion: action.promotion,
    };
    return { ...state, moves: [...state.moves, newMove], check: action.check };
  } else if (action.type === 'end') {
    return { ...state, winner: action.winner };
  } else if (action.type === 'promotion') {
    return {
      ...state,
      promotion: {
        color: action.color,
        initialColumn: action.initialColumn,
        initialRow: action.initialRow,
        column: action.column,
        row: action.row,
      },
    };
  } else if (action.type === 'end-promotion') {
    return { ...state, promotion: null };
  } else if (action.type === 'end-turn') {
    return { ...state, player: state.player === 'white' ? 'black' : 'white' };
  }
  return defaultBoardState;
};

const BoardProvider = (props) => {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    defaultBoardState
  );

  const addPiece = (figure, color, column, row) => {
    dispatchBoardState({
      type: 'add',
      figure,
      color,
      column,
      row,
    });
  };

  const removePiece = (column, row) => {
    dispatchBoardState({ type: 'remove', column: column, row: row });
  };

  const selectBoxes = (
    data = undefined,
    color = undefined,
    figure = undefined,
    column = undefined,
    row = undefined
  ) => {
    if (color && figure) {
      dispatchBoardState({
        type: 'highlight',
        select: data,
        piece: [color, figure, column, row],
      });
    } else {
      dispatchBoardState({ type: 'highlight', select: null, piece: null });
    }
  };

  const addMove = (piece, start, finish, check, promotion) => {
    dispatchBoardState({
      type: 'move',
      piece,
      start,
      finish,
      check,
      promotion,
    });
  };

  const endGame = (winner) => {
    dispatchBoardState({
      type: 'end',
      winner,
    });
  };

  const restart = () => {
    dispatchBoardState({ type: null });
  };

  const promotionPopUp = (color, initialColumn, initialRow, column, row) => {
    dispatchBoardState({
      type: 'promotion',
      color,
      initialColumn,
      initialRow,
      column,
      row,
    });
  };

  const endPromotion = () => {
    dispatchBoardState({ type: 'end-promotion' });
  };

  const endTurn = () => {
    dispatchBoardState({ type: 'end-turn' });
  };

  const boardContext = {
    items: boardState.items,
    player: boardState.player,
    select: boardState.select,
    selectedPiece: boardState.selectedPiece,
    moves: boardState.moves,
    check: boardState.check,
    winner: boardState.winner,
    promotion: boardState.promotion,
    addPiece,
    removePiece,
    selectBoxes,
    addMove,
    endGame,
    restart,
    promotionPopUp,
    endPromotion,
    endTurn,
  };

  return (
    <BoardContext.Provider value={boardContext}>
      {props.children}
    </BoardContext.Provider>
  );
};

export default BoardProvider;
