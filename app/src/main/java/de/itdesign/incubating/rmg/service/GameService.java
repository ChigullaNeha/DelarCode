package de.itdesign.incubating.rmg.service;

import de.itdesign.incubating.rmg.dto.GameCreator;
import de.itdesign.incubating.rmg.dto.ModifyPlayerData;
import de.itdesign.incubating.rmg.model.ChatMessage;
import de.itdesign.incubating.rmg.model.Game;
import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class GameService {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatHistoryService chatHistoryService;

    //to store all game sessions
    private final HashMap<String, Game> gameSession = new HashMap<>();


    //game host url
    @Value("${rmg_game_host}")
    private String rmgGameHostUrl;

    //will create game and initial dealer player as a result returns navigational game url with host
    public ResponseEntity<Object> createGame(String playerName){
        Game currentGame = new Game();
        Player dealer = new Player(UUID.randomUUID().toString(),playerName, Role.DEALER, List.of());
        currentGame.setPlayers(List.of(dealer));
        gameSession.put(currentGame.getId(), currentGame);
        String inviteUrl = rmgGameHostUrl + "/" + "game/"+currentGame.getId();
        GameCreator gameCreator = new GameCreator(dealer, inviteUrl, currentGame.getId());
        ChatMessage chatMessage = new ChatMessage(dealer.name(), "Game has been created!!!",LocalDateTime.now());
        chatHistoryService.addChatMessage(currentGame.getId(), chatMessage);
        simpMessagingTemplate.convertAndSend("/topics/messages/" + currentGame.getId(), chatMessage);
        return new ResponseEntity<>(gameCreator, HttpStatus.CREATED);
    }

    //it will find and returns the specified game otherwise it will return not found response
    public ResponseEntity<Object> getGame(String gameId){
        if(gameSession.containsKey(gameId)){
            return  new ResponseEntity<>(gameSession.get(gameId), HttpStatus.OK);
        }
        return new ResponseEntity<>("Game not found", HttpStatus.NOT_FOUND);
    }

    //if game session found it will create player and if player count exceeds or game not found it will give proper response
    public ResponseEntity<Object> createPlayer(String gameId , String playerName){
        Player newPlayer = new Player(UUID.randomUUID().toString(),playerName, Role.EMPLOYEE, List.of());
        if(gameSession.containsKey(gameId)){
            Game currentGame = gameSession.get(gameId);
            Collection<Player> players = currentGame.getPlayers();
            int playersSize = players.size();
            if(playersSize == 6){
                return new ResponseEntity<>("Game room is filled", HttpStatus.BAD_REQUEST);
            }
            boolean isPlayerNameAvailable = players.stream().anyMatch((player) -> player.name().equalsIgnoreCase(playerName));
            if(isPlayerNameAvailable){
                return new ResponseEntity<>("Player name already taken!.Please try with different player name", HttpStatus.BAD_REQUEST);
            }
            List<Player> updatablePlayers = new ArrayList<>(players);
            updatablePlayers.add(newPlayer);
            currentGame.setPlayers(updatablePlayers);
            simpMessagingTemplate.convertAndSend("/topics/lobby/" + gameId, updatablePlayers);
            return new ResponseEntity<>(newPlayer, HttpStatus.CREATED);
        }
        return new ResponseEntity<>("Game not found", HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<Object> updatePlayer(String gameId, ModifyPlayerData modifyPlayerData){
//        System.out.println(gameId);
        if(gameSession.containsKey(gameId)){
            Game currentGame = gameSession.get(gameId);
            List<Player> players = new ArrayList<>(currentGame.getPlayers());
            List<Player> updatedPlayers = players.stream().map((eachPlayer) -> {
                if (eachPlayer.id().equals(modifyPlayerData.getId())) {
                    return new Player(eachPlayer.id(),eachPlayer.name(), modifyPlayerData.getRole(), eachPlayer.scores());
                }
                return eachPlayer;
            }).toList();
            currentGame.setPlayers(updatedPlayers);
            return new ResponseEntity<>("Player updated", HttpStatus.OK);
        }
        return new ResponseEntity<>("Game is not available", HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<Object> deletePlayer(String gameId, String playerId){
        if(gameSession.containsKey(gameId)){
            Game currentGame = gameSession.get(gameId);
            List<Player> players = new ArrayList<>(currentGame.getPlayers());
            boolean isPlayerAvailable = players.stream().anyMatch((eachPlayer) -> eachPlayer.id().equals(playerId));

            if(!isPlayerAvailable){
                return new ResponseEntity<>("Player not available", HttpStatus.NOT_FOUND);
            }

            List<Player> updatedPlayers = players.stream()
                    .filter(eachPlayer -> !eachPlayer.id().equals(playerId))
                    .toList();
            currentGame.setPlayers(updatedPlayers);
            simpMessagingTemplate.convertAndSend("/topics/lobby/" + gameId, updatedPlayers);
            return new ResponseEntity<>("Player deleted successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Game not found", HttpStatus.NOT_FOUND);
    }

    //Retrieves the collection of players associated with a game identified by the given gameId
    public ResponseEntity<Object> getPlayers(String gameId) {
        Game currentGame = gameSession.get(gameId);

        if (currentGame == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Game not found with ID " + gameId);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        Collection<Player> players = currentGame.getPlayers();
        return new ResponseEntity<>(players, HttpStatus.OK);
    }

    //Retrieve a player by their ID from the specified game
    public ResponseEntity<Object> getPlayerById(String gameId, String playerId) {
        // Retrieve the current game using the provided gameId from the session
        Game currentGame = gameSession.get(gameId);

        if (currentGame == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Game not found with ID: " + gameId);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        Collection<Player> players = currentGame.getPlayers();
        Player player = players.stream().filter(p -> p.id().equals(playerId)).findFirst().orElse(null);

        if (player == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Player not found with ID: " + playerId);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(player, HttpStatus.OK);
    }
}
