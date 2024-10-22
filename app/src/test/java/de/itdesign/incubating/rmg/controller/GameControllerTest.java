package de.itdesign.incubating.rmg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.itdesign.incubating.rmg.controller.GameController;
import de.itdesign.incubating.rmg.model.Game;
import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.Role;
import de.itdesign.incubating.rmg.service.GameService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@WebMvcTest(GameController.class)
public class GameControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private GameService gameService;

    private String gameId = "12345";

    @Test
    public void testCreateGame() throws Exception{
        String mockUrl = "http://localhost:8080/game/12345";
        String playerName = "Hari";

        when(gameService.createGame(anyString())).thenReturn(new ResponseEntity<>(mockUrl, HttpStatus.CREATED));
        mockMvc.perform(post("/game")
                        .contentType("application/json")
                        .content(playerName))
                .andExpect(status().isCreated())
                .andExpect(content().string(mockUrl));
    }

    @Test
    public void testGetGameSuccess() throws Exception{
        Game mockGame = new Game();
        when(gameService.getGame(gameId)).thenReturn(new ResponseEntity<>(mockGame, HttpStatus.OK));

        mockMvc.perform(get("/game/{gameId}", gameId))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    public void testGetGameNotFound() throws Exception{
        when(gameService.getGame(gameId)).thenReturn(new ResponseEntity<>("Game not found", HttpStatus.NOT_FOUND));
        mockMvc.perform(get("/game/{gameId}", gameId))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Game not found"));
    }

    @Test
    public void testCreatePlayerSuccess() throws Exception{
        String playerName = "Hari";
        when(gameService.createPlayer(gameId, playerName)).thenReturn(new ResponseEntity<>("Player created successfully", HttpStatus.CREATED));

        mockMvc.perform(post("/game/{gameId}", gameId)
                        .contentType("application/json")
                        .content(playerName))
                .andExpect(status().isCreated())
                .andExpect(content().string("Player created successfully"));
    }

    @Test
    public void testCreatePlayerGameRoomFull() throws Exception{
        String playerName = "hari";

        when(gameService.createPlayer(gameId, playerName)).thenReturn(new ResponseEntity<>("Game room is full", HttpStatus.BAD_REQUEST));

        mockMvc.perform(post("/game/{gameId}", gameId)
                        .contentType("application/json")
                        .content(playerName))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Game room is full"));

}


    @Test
    public void testGetPlayers() throws Exception {

        List<Player> mockPlayers = List.of(
                new Player("1", Role.EMPLOYEE, "Player One", List.of(10, 20))

        );

        when(gameService.getPlayers(gameId)).thenReturn(new ResponseEntity<>(mockPlayers, HttpStatus.OK));

        ObjectMapper objectMapper = new ObjectMapper();

        mockMvc.perform(get("/game/{gameId}/players", gameId))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(content().json(objectMapper.writeValueAsString(mockPlayers)));

    }

    @Test
    public void testGetPlayerById() throws  Exception {

        String playerId = "123";
        Player player = new Player(playerId, Role.EMPLOYEE, "Player One", List.of(30, 40));
        when(gameService.getPlayerById(gameId, playerId)).thenReturn(new ResponseEntity<>(player, HttpStatus.OK));

        ObjectMapper objectMapper = new ObjectMapper();

        mockMvc.perform(get("/game/{gameId}/players/{playerId}", gameId, playerId))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
         .andExpect(content().json(objectMapper.writeValueAsString(player)));
    }


    @Test
    public void testGetPlayerByIdPlayerNotFound() throws Exception {
        String playerId = "123";
        String errorMessage = "Player not found with ID: " + playerId;
        when(gameService.getPlayerById(gameId, playerId))
                .thenReturn(new ResponseEntity<>(Map.of("message", errorMessage), HttpStatus.NOT_FOUND));

        ObjectMapper objectMapper = new ObjectMapper();

        mockMvc.perform(get("/game/{gameId}/players/{playerId}", gameId, playerId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType("application/json"))
                .andExpect(content().json(objectMapper.writeValueAsString(Map.of("message", errorMessage)))); // Expect JSON format

    }

    @Test
    public void testGetPlayerByIdGameNotFound() throws Exception {
        String playerId = "123";

        String errorMessage = "Game not found with ID: " + gameId;
        when(gameService.getPlayerById(gameId, playerId))
                .thenReturn(new ResponseEntity<>(Map.of("message", errorMessage), HttpStatus.NOT_FOUND));

        ObjectMapper objectMapper = new ObjectMapper();

        mockMvc.perform(get("/game/{gameId}/players/{playerId}", gameId, playerId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType("application/json"))
                .andExpect(content().json(objectMapper.writeValueAsString(Map.of("message", errorMessage)))); // Expect JSON format

    }

}