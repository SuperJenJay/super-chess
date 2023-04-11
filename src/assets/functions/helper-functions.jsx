const pawnAvailableMoves = (col, r, c, board) => {
  const direction = c === 'white' ? -1 : 1;
  const longStepIndex = c === 'white' ? 7 : 2;
  const rightAttack = { column: col - 1, row: r + direction };
  const leftAttack = { column: col + 1, row: r + direction };
  const moves = board.filter(
    (item) =>
      item.piece.color !== c &&
      ((item.column === rightAttack.column && item.row === rightAttack.row) ||
        (item.column === leftAttack.column && item.row === leftAttack.row))
  );
  const isInFrontTaken = board.filter(
    (item) => item.column === col && item.row === r + direction
  );
  const isAnotherTaken = board.filter(
    (item) => item.column === col && item.row === r + 2 * direction
  );
  if (r === longStepIndex) {
    if (isInFrontTaken.length === 1) {
      return moves;
    } else if (isInFrontTaken.length === 0 && isAnotherTaken.length === 1) {
      return moves.concat([{ column: col, row: r + direction }]);
    } else if (isInFrontTaken.length === 0 && isAnotherTaken.length === 0) {
      return moves.concat([
        { column: col, row: r + direction },
        { column: col, row: r + 2 * direction },
      ]);
    }
  } else {
    if (isInFrontTaken.length === 1) {
      return moves;
    } else {
      return moves.concat([{ column: col, row: r + direction }]);
    }
  }
};

const pawnsDangerZone = (col, r, c) => {
  const direction = c === 'white' ? -1 : 1;
  const rightAttack = { column: col - 1, row: r + direction };
  const leftAttack = { column: col + 1, row: r + direction };
  return [leftAttack, rightAttack].filter(
    (move) => move.column > 0 && move.column < 9 && move.row > 0 && move.row < 9
  );
};

const knightAvailableMoves = (col, r, c, board) => {
  const potentialMoves = [
    { column: col + 1, row: r + 2 },
    { column: col + 1, row: r - 2 },
    { column: col + 2, row: r + 1 },
    { column: col + 2, row: r - 1 },
    { column: col - 1, row: r + 2 },
    { column: col - 1, row: r - 2 },
    { column: col - 2, row: r + 1 },
    { column: col - 2, row: r - 1 },
  ];
  const filteredMoves = potentialMoves.filter(
    (move) =>
      1 <= move.column && move.column <= 8 && 1 <= move.row && move.row <= 8
  );
  const finalMoves = filteredMoves.filter((move) => {
    const index = board.findIndex(
      (item) => item.column === move.column && item.row === move.row
    );
    let possible = false;
    if (index !== -1) {
      possible = board[index].piece.color !== c;
    }
    return index === -1 || possible;
  });
  return finalMoves;
};

const examineConsecutiveMoves = (array, c, board) => {
  let filteredMoves = [];
  for (let i = 0; i < array.length; i++) {
    const move = array[i];
    const spaceInCtx = board.filter(
      (item) => move.column === item.column && move.row === item.row
    );
    if (spaceInCtx.length === 0) {
      filteredMoves.push(move);
    } else if (spaceInCtx[0].piece.color !== c) {
      filteredMoves.push(move);
      break;
    } else if (spaceInCtx[0].piece.color === c) {
      break;
    }
  }
  return filteredMoves;
};

const rookAvailableMoves = (col, r, c, board) => {
  const movesNorth = () => {
    let a = [];
    for (let i = 1; r - i > 0; i++) {
      a.push({ column: col, row: r - i });
    }
    return a;
  };
  const movesSouth = () => {
    let a = [];
    for (let i = 1; r + i <= 8; i++) {
      a.push({ column: col, row: r + i });
    }
    return a;
  };
  const movesEast = () => {
    let a = [];
    for (let i = 1; col + i <= 8; i++) {
      a.push({ column: col + i, row: r });
    }
    return a;
  };
  const movesWest = () => {
    let a = [];
    for (let i = 1; col - i > 0; i++) {
      a.push({ column: col - i, row: r });
    }
    return a;
  };
  const finalMoves = examineConsecutiveMoves(movesNorth(), c, board).concat(
    examineConsecutiveMoves(movesEast(), c, board),
    examineConsecutiveMoves(movesSouth(), c, board),
    examineConsecutiveMoves(movesWest(), c, board)
  );
  return finalMoves;
};

const bishopAvailableMoves = (col, r, c, board) => {
  const northEast = () => {
    let a = [];
    for (let i = 1; r - i > 0 && col + i <= 8; i++) {
      a.push({ column: col + i, row: r - i });
    }
    return a;
  };
  const northWest = () => {
    let a = [];
    for (let i = 1; r - i > 0 && col - i > 0; i++) {
      a.push({ column: col - i, row: r - i });
    }
    return a;
  };
  const southWest = () => {
    let a = [];
    for (let i = 1; r + i <= 8 && col - i > 0; i++) {
      a.push({ column: col - i, row: r + i });
    }
    return a;
  };
  const southEast = () => {
    let a = [];
    for (let i = 1; r + i <= 8 && col + i <= 8; i++) {
      a.push({ column: col + i, row: r + i });
    }
    return a;
  };
  const finalMoves = examineConsecutiveMoves(northEast(), c, board).concat(
    examineConsecutiveMoves(northWest(), c, board),
    examineConsecutiveMoves(southWest(), c, board),
    examineConsecutiveMoves(southEast(), c, board)
  );
  return finalMoves;
};

const queenAvaliableMoves = (col, r, c, board) => {
  return rookAvailableMoves(col, r, c, board).concat(
    bishopAvailableMoves(col, r, c, board)
  );
};

const didKingMoveThisGame = (moveList, color) => {
  return !!moveList.find(
    (move) => move.piece.color === color && move.piece.figure === 'king'
  );
};

const didRookMoveThisGame = (moveList, color, side) => {
  const rowColorIndex = color === 'white' ? 8 : 1;
  const columnSideIndex = side === 'left' ? 1 : 8;
  return !!moveList.find(
    (move) =>
      move.piece.figure === 'rook' &&
      move.start.column === columnSideIndex &&
      move.start.row === rowColorIndex
  );
};

const isSpaceBetweenRookAndKingEmpty = (boardContext, side, color) => {
  const rowColorIndex = color === 'white' ? 8 : 1;
  const leftBoxes = [
    { column: 2, row: rowColorIndex },
    { column: 3, row: rowColorIndex },
    { column: 4, row: rowColorIndex },
  ];
  const rightBoxes = [
    { column: 6, row: rowColorIndex },
    { column: 7, row: rowColorIndex },
  ];
  const boxes = side === 'left' ? leftBoxes : rightBoxes;
  const takenBoxes = boxes.filter((box) => {
    const boxInIndex = boardContext.find(
      (item) => box.column === item.column && box.row === item.row
    );
    return !!boxInIndex;
  });
  return takenBoxes.length === 0 ? true : false;
};

const kingAvailableMoves = (col, r, c, board) => {
  const basicMoves = [
    { column: col + 1, row: r },
    { column: col + 1, row: r - 1 },
    { column: col, row: r - 1 },
    { column: col - 1, row: r - 1 },
    { column: col - 1, row: r },
    { column: col - 1, row: r + 1 },
    { column: col, row: r + 1 },
    { column: col + 1, row: r + 1 },
  ];
  const possibleMoves = basicMoves.filter(
    (move) => move.column > 0 && move.column < 9 && move.row > 0 && move.row < 9
  );
  const filteredMoves = possibleMoves.filter((move) => {
    const index = board.findIndex(
      (item) => item.column === move.column && item.row === move.row
    );
    let isDifferentColor = false;
    if (index !== -1 && board[index].piece.color !== c) {
      isDifferentColor = true;
    }
    return index === -1 || isDifferentColor;
  });
  return filteredMoves;
};

export const availableMoves = (f, col, r, c, board) => {
  switch (f) {
    case 'pawn':
      return pawnAvailableMoves(col, r, c, board);
    case 'rook':
      return rookAvailableMoves(col, r, c, board);
    case 'knight':
      return knightAvailableMoves(col, r, c, board);
    case 'bishop':
      return bishopAvailableMoves(col, r, c, board);
    case 'queen':
      return queenAvaliableMoves(col, r, c, board);
    case 'king':
      return kingAvailableMoves(col, r, c, board);
  }
};

const simulateNextMove = (
  ctxCopy,
  destinedColumn,
  destinedRow,
  startingColumn,
  startingRow,
  pieceColor,
  pieceFigure
) => {
  ctxCopy = ctxCopy.filter(
    (item) => item.column !== startingColumn || item.row !== startingRow
  );
  const index = ctxCopy.findIndex(
    (item) => item.column === destinedColumn && item.row === destinedRow
  );
  if (index === -1) {
    ctxCopy.push({
      column: destinedColumn,
      row: destinedRow,
      piece: { color: pieceColor, figure: pieceFigure },
    });
  } else {
    ctxCopy.splice(index, 1, {
      column: destinedColumn,
      row: destinedRow,
      piece: { color: pieceColor, figure: pieceFigure },
    });
  }
  return ctxCopy;
};

const dangerZoneOfOneColor = (color, board) => {
  let dangerZone = [];
  for (const item of board) {
    if (item.piece.color === color) {
      let itemMoves;
      if (item.piece.figure !== 'pawn') {
        itemMoves = availableMoves(
          item.piece.figure,
          item.column,
          item.row,
          item.piece.color,
          board
        );
      } else {
        itemMoves = pawnsDangerZone(item.column, item.row, item.piece.color);
      }
      if (itemMoves.length > 0) {
        dangerZone = dangerZone.concat(itemMoves);
      }
    }
  }
  return dangerZone;
};

const isCastlingPathSafe = (color, board, side) => {
  const rowColorIndex = color === 'white' ? 8 : 1;
  const castlingPath =
    side === 'left'
      ? [
          { column: 3, row: rowColorIndex },
          { column: 4, row: rowColorIndex },
        ]
      : [
          { column: 6, row: rowColorIndex },
          { column: 7, row: rowColorIndex },
        ];
  const dangerZone = dangerZoneOfOneColor(enemyColor(color), board);
  return !dangerZone.find(
    (spot) =>
      (spot.column === castlingPath[0].column &&
        spot.row === castlingPath[0].row) ||
      (spot.column === castlingPath[1].column &&
        spot.row === castlingPath[1].row)
  );
};

export const canPerformCastling = (moveList, color, side, board, check) => {
  return (
    !didKingMoveThisGame(moveList, color) &&
    !didRookMoveThisGame(moveList, color, side) &&
    isSpaceBetweenRookAndKingEmpty(board, side, color) &&
    !check &&
    isCastlingPathSafe(color, board, side)
  );
};

export const enemyColor = (color) => {
  return color === 'white' ? 'black' : 'white';
};

export const isKingSafeAfterThisMove = (
  destinedColumn,
  destinedRow,
  boardContext,
  startingColumn,
  startingRow,
  pieceColor,
  pieceFigure
) => {
  const ctxCopy = boardContext;
  const newCtx = simulateNextMove(
    ctxCopy,
    destinedColumn,
    destinedRow,
    startingColumn,
    startingRow,
    pieceColor,
    pieceFigure
  );
  const enemyDangerZone = dangerZoneOfOneColor(enemyColor(pieceColor), newCtx);
  const kingCoords = newCtx.find(
    (item) => item.piece.color === pieceColor && item.piece.figure === 'king'
  );
  const isKingSafe = enemyDangerZone.findIndex(
    (move) => move.column === kingCoords.column && move.row === kingCoords.row
  );
  return isKingSafe === -1;
};

export const isEnemyKingChecked = (
  destinedColumn,
  destinedRow,
  boardContext,
  startingColumn,
  startingRow,
  pieceColor,
  pieceFigure
) => {
  const ctxCopy = boardContext;
  const newCtx = simulateNextMove(
    ctxCopy,
    destinedColumn,
    destinedRow,
    startingColumn,
    startingRow,
    pieceColor,
    pieceFigure
  );
  const dangerZone = dangerZoneOfOneColor(pieceColor, newCtx);
  const enemyKingCoords = newCtx.find((item) => {
    return item.piece.color !== pieceColor && item.piece.figure === 'king';
  });
  const isEnemyKingSafe = dangerZone.findIndex((move) => {
    return (
      move.column === enemyKingCoords.column && move.row === enemyKingCoords.row
    );
  });
  return isEnemyKingSafe !== -1;
};

export const howMuchMovesDoesEnemyHaveAfterThisMove = (
  destinedColumn,
  destinedRow,
  boardContext,
  startingColumn,
  startingRow,
  pieceColor,
  pieceFigure
) => {
  let moveCounter = 0;
  const ctxCopy = boardContext;
  const newCtx = simulateNextMove(
    ctxCopy,
    destinedColumn,
    destinedRow,
    startingColumn,
    startingRow,
    pieceColor,
    pieceFigure
  );
  const listOfEnemyInCurrentContext = newCtx.filter(
    (item) => item.piece.color === enemyColor(pieceColor)
  );
  for (let enemy of listOfEnemyInCurrentContext) {
    let currentEnemyMoves = availableMoves(
      enemy.piece.figure,
      enemy.column,
      enemy.row,
      enemy.piece.color,
      newCtx
    );
    if (currentEnemyMoves.length > 0) {
      for (let move of currentEnemyMoves) {
        const probableCtx = simulateNextMove(
          newCtx,
          move.column,
          move.row,
          enemy.column,
          enemy.row,
          enemy.piece.color,
          enemy.piece.figure
        );
        const enemyKing = probableCtx.find(
          (item) =>
            item.piece.figure === 'king' &&
            item.piece.color === enemyColor(pieceColor)
        );
        const dangerZoneOfFriendlyBoard = dangerZoneOfOneColor(
          pieceColor,
          probableCtx
        );
        const dangerForKing = dangerZoneOfFriendlyBoard.findIndex((field) => {
          return (
            field.column === enemyKing.column && field.row === enemyKing.row
          );
        });
        if (dangerForKing === -1) {
          moveCounter++;
        }
      }
    }
  }
  return moveCounter;
};
