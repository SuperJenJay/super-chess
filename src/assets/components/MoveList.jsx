import classes from './MoveList.module.css';
import BoardContext from '../state/board-context';
import { useContext, useRef, useEffect } from 'react';
import React from 'react';

const MoveList = () => {
  const boardCtx = useContext(BoardContext);
  const moveList = useRef();
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const content = boardCtx.moves.map((move, index) => (
    <li key={index}>
      {`${index + 1}. A ${move.piece.color} ${move.piece.figure} moved from ${
        columns[move.start.column - 1]
      }${rows[move.start.row - 1]} to ${columns[move.finish.column - 1]}${
        rows[move.finish.row - 1]
      }.${move.check ? ' check!' : ''}${
        move.promotion ? ` promotion to ${move.promotion}!` : ''
      }`.toUpperCase()}
    </li>
  ));

  const scrollToBottom = () => {
    if (moveList.current) {
      moveList.current.scrollTop = moveList.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [content]);

  return (
    <ul ref={moveList} className={classes.movelist}>
      {content}
    </ul>
  );
};

export default MoveList;
