import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';

const hostUrl = 'http://localhost:3000/game';

const InvitePlayer = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  const { gameId } = useParams();

  //fetching game url, initial player data from local storage
  useEffect(() => {
    const finalUrl = `${hostUrl}/${gameId}`;
    const moderatorData = localStorage.getItem('currentPlayer');
    if (moderatorData != null) {
      const moderator = JSON.parse(moderatorData);
      setInviteUrl(finalUrl);
      setPlayerName(moderator.name);
      setPlayerId(moderator.id);
    }
  }, []);

  //copying link to clipboard
  const onClickCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickLobby = () => {
    navigate(`/game/lobby/${gameId}?playerId=${playerId}`);
  };

  return (
    <div className="invite-player-main-container">
      <div className="invite-link-container">
        <h1 className="welcome-player-text">Welcome, {playerName}</h1>
        <p className="invite-link-text">{inviteUrl}</p>
        <button className="custom-game-btn" onClick={onClickCopyLink}>
          {isCopied ? 'copied' : 'copy'}
        </button>
        <button className="custom-game-btn" onClick={onClickLobby}>
          Enter Game Lobby
        </button>
      </div>
    </div>
  );
};

export default InvitePlayer;
