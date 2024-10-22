import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const serverUrl = 'http://localhost:8080/game';

const CreateGame = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleCreateGameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitGame();
  };

  const handlePlayerName = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  //sending post request to server to create a game
  const submitGame = async () => {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: playerName,
    };
    try {
      const response = await fetch(serverUrl, config);
      if (response.ok) {
        const data = await response.json();
        const { dealer, gameId } = data;

        localStorage.setItem('currentPlayer', JSON.stringify(dealer));
        setPlayerName('');
        navigate(`/game/invite/${gameId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-game-main-container">
      <form className="create-game-form-container" onSubmit={handleCreateGameSubmit}>
        <input type="text" placeholder="Enter your Name" className="player-name" value={playerName} onChange={handlePlayerName} />
        <button className="custom-game-btn" type="submit">
          Create Game
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
