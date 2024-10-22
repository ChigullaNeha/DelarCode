import React, { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Player } from '../../types/types';
import './index.css';

const JoinGame: React.FC = () => {
  const { gameId } = useParams(); // Getting the game ID from the URL
  const [playerName, setPlayerName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();

  // This function handles the "Join Game" button click
  const onHandleJoinGameButton = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (playerName.trim() === '') {
      setErrorMsg("Name can't be empty");
      return;
    }

    try {
      // Make a POST request to join the game with the given player name
      console.log(JSON.stringify(playerName));
      const response = await fetch(`http://localhost:8080/game/${gameId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json',
        },
        body: playerName,
      });
      console.log(response);
      if (!response.ok) {
        const data = await response.text();

        setErrorMsg(data);
      } else {
        const data: Player = await response.json();
        navigate(`/game/lobby/${gameId}?playerId=${data.id}`, { replace: true });
        setErrorMsg('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="join-game-container">
      <div className="join-game-content">
        <form className="join-game-input-container" onSubmit={onHandleJoinGameButton}>
          <input type="text" className="join-game-input" placeholder="Enter Your Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <button type="submit" className="join-game-button">
            Join Game
          </button>
          {errorMsg && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default JoinGame;
