package de.itdesign.incubating.rmg.controller;

import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.Role;
import de.itdesign.incubating.rmg.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PlayerController {
    @Autowired
    public PlayerService playerService;
    @MessageMapping("/players")
    @SendTo("/topic/players")
    public List<Player> getPlayers() { //Method to Get All explicitly written players
    return playerService.getPlayers();
}
    // get players list copy
    @MessageMapping("/playersCopy")
    @SendTo("/topic/playersCopy") // Broadcast to all subscribers
    public List<Player> getPlayersCopy() {
        // Call the service method to get the copy of players
        return playerService.getPlayersCopy();
    }

    // Get original players
    @MessageMapping("/players/original")
    @SendTo("/topic/originalPlayers")
    public ResponseEntity<Object> getOriginalPlayers(String gameId) {
        return playerService.getOriginalPlayers(gameId);
    }

    // Get modified players
    @MessageMapping("/players/modified")
    @SendTo("/topic/modifiedPlayers")
    public List<Player> getModifiedPlayers() {
        return playerService.getModifiedPlayers();
    }

    // Add a player to the modified list
    @MessageMapping("/players/addToModified")
    @SendTo("/topic/addPlayerToPlayersCopy")
    public void addPlayerToModified(Player player) {
        playerService.addPlayerToModified(player);
//        return playerService.getModifiedPlayers(); // Return updated list after adding the player
    }

    // Remove a player from the modified list
    @MessageMapping("/players/removeFromModified")
    @SendTo("/topic/remove/player")
    public void removePlayerFromModified(String id) {
        playerService.removePlayerFromModified(id);
//        return playerService.getModifiedPlayers(); // Return updated list after removing the player
    }

    // Reset the modified players list
    @MessageMapping("/players/resetModified")
    @SendTo("/topic/reset/players")
    public void resetModifiedPlayers() {
        playerService.resetModifiedPlayers();
    }

















    // Method to remove particular player
//    @MessageMapping("/removePlayer")
//    @SendTo("/topic/removePlayer")  // Broadcast updated list to all subscribers
//    public List<Player> removePlayerById(@Payload String playerId) {
//        return playerService.removePlayerById(playerId);
//    }


    // WebSocket endpoint to add a player
//    @MessageMapping("/addPlayer")  // Receives a message at this destination
//    @SendTo("/topic/addPlayer")  // Broadcasts the updated list to all subscribers
//    public List<Player> addPlayer(@Payload PlayerData playerData) {
//        // Call the PlayerService to add a new player
//        List<Player> updatedPlayers = playerService.addPlayer(
//                playerData.getPlayerId(),
//                playerData.getPlayerName(),
//                playerData.getRole(),
//                playerData.getScores()
//        );
//        // Broadcast the updated list of players to all subscribers
//        return updatedPlayers;
//    }
    // Helper class to encapsulate player data received from the client
    public static class PlayerData {
        private String playerId;
        private String playerName;
        private Role role;
        private List<Integer> scores;

        // Getters and setters for the fields
        public String getPlayerId() {
            return playerId;
        }

        public void setPlayerId(String playerId) {
            this.playerId = playerId;
        }

        public String getPlayerName() {
            return playerName;
        }

        public void setPlayerName(String playerName) {
            this.playerName = playerName;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
        }

        public List<Integer> getScores() {
            return scores;
        }

        public void setScores(List<Integer> scores) {
            this.scores = scores;
        }
    }
}
