import classes from './Promotion.module.css';
import PromoPiece from './PromoPiece';

function Promotion() {
  const pieces = ['knight', 'bishop', 'rook', 'queen'];

  return (
    <div className={classes.promotion}>
      <p>Choose a piece to promote your pawn into:</p>
      <div className={classes.set}>
        {pieces.map((piece) => (
          <PromoPiece name={piece} key={piece} />
        ))}
      </div>
    </div>
  );
}

export default Promotion;
