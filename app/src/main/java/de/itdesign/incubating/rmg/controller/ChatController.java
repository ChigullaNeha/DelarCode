package de.itdesign.incubating.rmg.controller;

import de.itdesign.incubating.rmg.model.*;

import de.itdesign.incubating.rmg.service.ChatHistoryService;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
 public class ChatController {

    private final ChatHistoryService chatHistoryService;

    private Map<String, String> users = new HashMap<>(); // Track active users

    public ChatController(ChatHistoryService chatHistoryService, SimpMessagingTemplate simpMessagingTemplate  ) {

        this.chatHistoryService = chatHistoryService;
    }

    @MessageMapping("/join/{gameId}")
    @SendTo("/topics/messages/{gameId}")
    public ChatMessage handlePlayerJoin(@DestinationVariable String gameId, String playerName) {
        ChatMessage newMessage = new ChatMessage("Dealer",playerName+" has joined the game!", LocalDateTime.now());
        chatHistoryService.addChatMessage(gameId, newMessage);
        return newMessage;
    }

    // MessageMapping for handling player remove/leave event
    @MessageMapping("/remove/{gameId}")
    @SendTo("/topics/messages/{gameId}")
    public ChatMessage handlePlayerLeave(@DestinationVariable String gameId, String playerName) {
        ChatMessage newMessage = new ChatMessage("Dealer",playerName+" has left the game!", LocalDateTime.now());
        chatHistoryService.addChatMessage(gameId, newMessage);
        return newMessage;
    }


    @MessageMapping("/chat/{gameId}")
    @SendTo("/topics/messages/{gameId}")
    public ChatMessage sendMessage(@DestinationVariable String gameId, ChatMessage chatMessage) {
        // Add the chat message to the relevant session's chat history
        chatHistoryService.addChatMessage(gameId, chatMessage);
        chatMessage.setDateTime(LocalDateTime.now());
        // Return the message to be sent to subscribers of this session
        return chatMessage;
    }


    @MessageMapping("/chat/history/{gameId}") // WebSocket endpoint for fetching chat history for a specific game
    @SendTo("/topics/chat-history/{gameId}") // Broadcast the chat history to subscribers of this topic
    public List<ChatMessage> sendChatHistory(@DestinationVariable String gameId) {
        // Retrieve the chat history for the specified gameId
        List<ChatMessage> chatHistory = chatHistoryService.getChatHistory(gameId);

        // Return the chat history to be sent to subscribers of this session
        return chatHistory;
    }


    @MessageMapping("/requestForResource/{gameId}") // Add gameId to the mapping
    @SendTo("/topics/messages/{gameId}")
    public ChatMessage requestedForResourceCard(@DestinationVariable String gameId, PlayerAction messageDetails) {
        return chatHistoryService.addingProjectManagersRequest(gameId,messageDetails);
    }

    @MessageMapping("/sendingResourceCard/{gameId}") // Add gameId to the mapping
    @SendTo("/topics/messages/{gameId}")
    public ChatMessage sendingResourceCard(@DestinationVariable String gameId, PlayerAction messageDetails) {
        return chatHistoryService.addingResourceManagerMessage(messageDetails);
    }

    @MessageMapping("/dealerAction/{gameId}") // Add gameId to the mapping
    @SendTo("/topics/messages/{gameId}")
    public ChatMessage performDealerAction(@DestinationVariable String gameId, DealerAction messageDetails) {
        if (messageDetails.getProject() == null) {
            return chatHistoryService.addPlayerAssignmentMessage(messageDetails);
        }
        return chatHistoryService.addProjectAssignmentMessage(messageDetails);
    }



}