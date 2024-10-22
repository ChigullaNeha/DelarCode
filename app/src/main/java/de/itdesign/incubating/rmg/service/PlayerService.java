package de.itdesign.incubating.rmg.service;

import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import static de.itdesign.incubating.rmg.model.Role.PLAYER;

@Service
public class PlayerService {
    private final Collection<Player> originalPlayers = new ArrayList<>();
    private final List<Player> modifiedPlayers = new ArrayList<>();
    private final List<Player> players = new ArrayList<>();

    @Autowired
    private GameService gameService;

    public PlayerService() {
        // Initialize players with the required list of scores
//        players.add(new Player("1", PLAYER, "Zoya", Arrays.asList(10, 20, 30)));
//        players.add(new Player("2", PLAYER, "Leo", Arrays.asList(15, 25, 35)));
//        players.add(new Player("3", PLAYER, "Max", Arrays.asList(12, 22, 32)));
//        players.add(new Player("4", PLAYER, "Ben", Arrays.asList(18, 28, 38)));
//        players.add(new Player("5", PLAYER, "Jay", Arrays.asList(20, 30, 40)));
    }

    // Get original players
    public ResponseEntity<Object> getOriginalPlayers(String gameId) {
        // Get players from the game service
        ResponseEntity<Object> response = gameService.getPlayers(gameId);

        // Check if the response is valid and contains a list of players
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() instanceof Collection) {
            Collection<?> responseBody = (Collection<?>) response.getBody();

            // Ensure the list is not empty and contains Player objects
            if (!responseBody.isEmpty() && responseBody.iterator().next() instanceof Player) {
                Collection<Player> playersFromGame = (Collection<Player>) responseBody;

                // Update the original players list
                originalPlayers.clear();
                originalPlayers.addAll(playersFromGame);

                // Initialize modifiedPlayers if it is empty
                if (modifiedPlayers.isEmpty()) {
                    modifiedPlayers.addAll(originalPlayers);
                }

                // Return the updated original players
                return new ResponseEntity<>(new ArrayList<>(originalPlayers), HttpStatus.OK);
            }
        }

        // Return an error if players could not be retrieved
        return new ResponseEntity<>("Failed to retrieve players. Please check the game ID.", HttpStatus.BAD_REQUEST);
    }

    // Get modified players
    public List<Player> getModifiedPlayers() {
        return new ArrayList<>(modifiedPlayers); // Return a copy of the modified players list
    }

    // Add a player to the modified list
    public void addPlayerToModified(Player player) {
        System.out.println("player added into modified list");
        modifiedPlayers.add(player);
    }

    // Remove a player from the modified list
    public void removePlayerFromModified(String id) {
        // Find the project by its ID and remove it from the modified list
        System.out.println("player removed from modified list");
        modifiedPlayers.removeIf(player -> player.id().equals(id));
    }


    // Reset the modified players list
    public void resetModifiedPlayers() {
        modifiedPlayers.clear();
        modifiedPlayers.addAll(originalPlayers);
        System.out.println("reset players done");
    }

    // Get initialized list of players with scores
    public List<Player> getPlayers() {
        return new ArrayList<>(players); // Return a copy of the initialized players list
    }

    // Create a copy of the current players list
    public List<Player> getPlayersCopy() {
        List<Player> playersCopyList = new ArrayList<>(players);
        System.out.println(playersCopyList);
        return playersCopyList;
    }
}
