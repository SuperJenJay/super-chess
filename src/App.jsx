import './App.css';
import Board from './assets/components/Board';
import SpecialEvent from './assets/components/SpecialEvent';
import SideBar from './assets/components/SideBar';
import BoardProvider from './assets/state/BoardProvider';

function App() {
  return (
    <BoardProvider>
      <SpecialEvent />
      <Board />
      <SideBar />
    </BoardProvider>
  );
}

export default App;
