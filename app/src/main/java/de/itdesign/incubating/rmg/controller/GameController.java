package de.itdesign.incubating.rmg.controller;
import de.itdesign.incubating.rmg.dto.ModifyPlayerData;
import de.itdesign.incubating.rmg.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/game")
    public ResponseEntity<Object> createGame(@RequestBody String playerName){
        return gameService.createGame(playerName);
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<Object> getGame(@PathVariable("gameId") String gameId){
        return gameService.getGame(gameId);
    }

    @PostMapping("/game/{gameId}")
    public ResponseEntity<Object> createPlayer(@PathVariable("gameId") String gameId , @RequestBody String playerName){
        return gameService.createPlayer(gameId, playerName);
    }

    @GetMapping("/game/{gameId}/players")
    public ResponseEntity<Object> getPlayers(@PathVariable("gameId") String gameId) {
        return gameService.getPlayers(gameId);
    }

    @GetMapping("/game/{gameId}/players/{playerId}")
    public ResponseEntity<Object> getPlayerById(@PathVariable("gameId") String gameId, @PathVariable("playerId") String playerId) {
        return gameService.getPlayerById(gameId, playerId);
    }

    @PutMapping("/game/{gameId}")
    public  ResponseEntity<Object> updatePlayer(@PathVariable("gameId") String gameId,@RequestBody ModifyPlayerData modifyPlayerData){
        return gameService.updatePlayer(gameId, modifyPlayerData);
    }
    @DeleteMapping("/game/{gameId}")
    public ResponseEntity<Object> deletePlayer(@PathVariable("gameId") String gameId, @RequestParam("playerId") String playerId){
        return gameService.deletePlayer(gameId,playerId);
    }


}
