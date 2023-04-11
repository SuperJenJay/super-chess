import React from 'react';

const BoardContext = React.createContext({
  items: [],
  player: 'white',
  select: null,
  selectedPiece: [],
  moves: [],
  check: false,
  winner: null,
  promotion: null,
  addPiece: () => {},
  removePiece: () => {},
  selectBoxes: () => {},
  addMove: () => {},
  endGame: () => {},
  restart: () => {},
  promotionPopUp: () => {},
  endPromotion: () => {},
  endTurn: () => {},
});

export default BoardContext;
