import classes from './SideBar.module.css';
import React from 'react';
import Turn from './Turn';
import MoveList from './MoveList';

function SideBar() {
  return (
    <div className={classes.sidebar}>
      <Turn />
      <MoveList />
    </div>
  );
}

export default SideBar;
