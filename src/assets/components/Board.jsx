import classes from './Board.module.css';
import Box from './Box';
import Labels from './Labels';

const Board = () => {
  const arrayOfPositions = () => {
    let a = [];
    for (let j = 1; j <= 8; j++) {
      for (let i = 1; i <= 8; i++) {
        a.push([i, j]);
      }
    }
    return a;
  };

  const content = arrayOfPositions().map((xy) => (
    <Box column={xy[0]} row={xy[1]} key={Math.random()}></Box>
  ));

  return (
    <div className={classes.board}>
      <Labels />
      {content}
    </div>
  );
};

export default Board;
