import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './Index.css';

interface PlayerData {
  id: string;
  name: string;
  role: string;
  scores: number[];
}

const Score = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const [currentPlayer, setCurrentPlayer] = useState<PlayerData>();

  const searchParams = new URLSearchParams(location.search);
  const playerId = searchParams.get('playerId');

  const [playersData, setPlayersData] = useState<PlayerData[]>([]);

  useEffect(() => {
    const fetchPlayersData = async () => {
      const response = await fetch(`http://localhost:8080/game/${gameId}/players`);
      const data = await response.json();
      setPlayersData(data);
      getCurrentPlayer(data);
    };

    fetchPlayersData();
  }, []);

  const getCurrentPlayer = (data: PlayerData[]) => {
    const currentPlayer = data.find((player) => player.id === playerId);
    setCurrentPlayer(currentPlayer);
  };

  // Function to calculate total scores for a specific round
  const calculateRoundTotals = (roundIndex: number) => {
    const total = playersData.filter((player) => player.role !== 'DEALER').reduce((total, player) => total + (player.scores[roundIndex] || 0), 0);
    return total;
  };

  return (
    <div>
      <div className="score-heading-container">
        <h1 className="score-heading">Welcome, {currentPlayer?.name}</h1>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Round 1</th>
              <th>Round 2</th>
              <th>Round 3</th>
              <th>Round 4</th>
            </tr>
          </thead>
          <tbody>
            {playersData.length > 0 &&
              playersData.map(
                (player, index) =>
                  player.role !== 'DEALER' && (
                    <tr key={index}>
                      <td>{player.name}</td>
                      {[...Array(4)].map((_, index) => (
                        <td key={index}>{player.scores[index] !== undefined ? player.scores[index] : ''}</td>
                      ))}
                    </tr>
                  ),
              )}
            <tr>
              <td className="total">Total</td>
              {[...Array(4)].map((_, roundIndex) => (
                <td key={roundIndex}>{calculateRoundTotals(roundIndex) !== 0 ? calculateRoundTotals(roundIndex) : ''}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Score;
