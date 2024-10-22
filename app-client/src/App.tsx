import { Route, Routes } from 'react-router-dom';
import './App.css';
// import ChatWindow from './components/ChatWindow';
import CreateGame from './components/CreateGame';
import GameLobby from './components/GameLobby';
import InvitePlayer from './components/InvitePlayer';
import JoinGame from './components/JoinGame/index';
import Score from './components/Score/Index';
import DealerPage from "./Components/DealerPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter as Router} from "react-router-dom";
import Player from "./Components/Player";
import ChatWindow from './Components/ChatWindow';

const App = () => {
  return (
      <DndProvider backend={HTML5Backend}>
    <div className="main-app-container">
      <Routes>
        <Route path="/" element={<CreateGame />} />
        <Route path="/game/invite/:gameId" element={<InvitePlayer />} />
        <Route path="/game/score/:gameId" element={<Score />} />
        <Route path="/game/:gameId" element={<JoinGame />} />
        <Route path="/game/dealer/:gameId" element={<DealerPage />} />
        <Route path="/game/players" element={<Player />} />
        <Route path="/game/lobby/:gameId" element={<GameLobby />} />
      </Routes>
       <ChatWindow /> 
    </div>
   </DndProvider>



  );
}

export default App;
