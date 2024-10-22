import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Player, Role, SessionPlayer } from '../../types/types';
import './index.css';

const gameServerUrl: string = 'http://localhost:8080/game';
const maxPlayers: number = 6;

const GameLobby = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [waitingPlayersCount, setWaitingPlayersCount] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<SessionPlayer>(Object);
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [baseApiUrl, setBaseApiUrl] = useState<string>('');
  const [client, setClient] = useState<Client>();
  const { gameId } = useParams();
  const location = useLocation();
  const { search } = location;
  const searchParams = new URLSearchParams(search);
  const playerId = searchParams.get('playerId');
  const navigate = useNavigate();

  useEffect(() => {
    //has to update with get player API
    const finalUrl = `${gameServerUrl}/${gameId}`;
    setBaseApiUrl(finalUrl);
    getGameDetails(finalUrl);
  }, []);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to the WebSocket.');
        stompClient.subscribe(`/topics/lobby/${gameId}`, (message) => {
          const updatedPlayers = JSON.parse(message.body);
          setPlayers(updatedPlayers);
          setWaitingPlayersCount(maxPlayers - updatedPlayers.length);
        });
      },
      onStompError: (frame) => {
        console.error('Broker Error: ' + frame.headers['message']);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket connection lost.');
        console.log('Close event details:', event);
        if (event) {
          console.log('Code:', event.code);
          console.log('Reason:', event.reason);
          console.log('Was Clean:', event.wasClean);
        }
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [gameId]);

  const getGameDetails = async (gameUrl: string) => {
    try {
      const response = await fetch(gameUrl);
      const data = await response.json();
      const currentPlayer = data.players.find((eachPlayer: Player) => eachPlayer.id === playerId);
      console.log(data.players);
      if (currentPlayer.role === Role.DEALER) {
        setIsModerator(true);
      }

      setPlayers(data.players);
      setCurrentPlayer(currentPlayer);
      setWaitingPlayersCount(maxPlayers - data.players.length);
    } catch (error) {
      console.log(error);
    }
  };

  const renderPlayerPlaceHolders = () => {
    const placeHolderArray = Array(waitingPlayersCount).fill({ status: 'Waiting...' });

    return placeHolderArray.map((eachPlaceHolder, index) => (
      <div key={`${eachPlaceHolder}-${index}`} className="player-board-container">
        <h2 className="onboard-player-name">{eachPlaceHolder.status}</h2>
      </div>
    ));
  };

  const handleRemovePlayer = async (playerId: string, playerName: string) => {
    const config = {
      method: 'DELETE',
    };
    const deleteApiUrl = `${baseApiUrl}?playerId=${playerId}`;
    const response = await fetch(deleteApiUrl, config);
    if (response.ok) {
      const data = await response.text();
      // getGameDetails(baseApiUrl);

      if (client && client.connected) {
        client.publish({
          destination: `/game/remove/${gameId}`,
          body: playerName,
        });
      }
      console.log(data);
    }
  };

  return (
    <div className="game-lobby-main-container">
      <h1 className="game-lobby-welcome-text">Welcome, {currentPlayer.name}</h1>
      <div className="players-group-container">
        {players.map((eachPlayer: Player) => (
          <div key={eachPlayer.id} className="player-board-container">
            <h2 className="onboard-player-name">{eachPlayer.name}</h2>
            {!isModerator && eachPlayer.role === 'DEALER' && <p className="highlight-current-player">(Moderator)</p>}
            {currentPlayer.name === eachPlayer.name && <p className="highlight-current-player">(You)</p>}
            {isModerator && eachPlayer.role !== 'DEALER' && (
              <button className="remove-player-btn" onClick={() => handleRemovePlayer(eachPlayer.id, eachPlayer.name)}>
                Remove
              </button>
            )}
          </div>
        ))}
        {waitingPlayersCount > 0 && renderPlayerPlaceHolders()}
        {isModerator && players.length === maxPlayers && <button className="take-off-btn" onClick={() => navigate(`/game/dealer/${gameId}`)}>Take off</button>}
      </div>
    </div>
  );
};

export default GameLobby;
