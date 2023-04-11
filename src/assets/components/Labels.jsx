import classes from './Labels.module.css';
import React from 'react';

function Labels() {
  const alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const numberArray = [8, 7, 6, 5, 4, 3, 2, 1];
  const horizontalLabel = alphabetArray.map((letter) => (
    <p key={letter}>{letter}</p>
  ));
  const verticalLabel = numberArray.map((number) => (
    <p key={number}>{number}</p>
  ));

  return (
    <React.Fragment>
      <div className={classes.horizontal}>{horizontalLabel}</div>
      <div className={classes.vertical}>{verticalLabel}</div>
    </React.Fragment>
  );
}

export default Labels;
