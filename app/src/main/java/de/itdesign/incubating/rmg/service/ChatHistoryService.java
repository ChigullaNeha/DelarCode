package de.itdesign.incubating.rmg.service;

import de.itdesign.incubating.rmg.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatHistoryService {
    private final Map<String, List<ChatMessage>> chatHistories = new HashMap<>();

    // Add a chat message to the session
    public void addChatMessage(String gameId, ChatMessage message) {
        chatHistories.putIfAbsent(gameId, new ArrayList<>()); // Initialize if not exists
        chatHistories.get(gameId).add(message);
        System.out.println(chatHistories);
        chatHistories.get(gameId).forEach((each) -> System.out.println(each.getMessage()));// Add message to the session's chat history
    }

    // Get chat history for a session
    public List<ChatMessage> getChatHistory(String gameId) {
//        return chatHistories.getOrDefault(gameId, new ArrayList<>());
        // Return chat history or empty list

        return chatHistories.getOrDefault(gameId, new ArrayList<>());

    }



    public ChatMessage addingProjectManagersRequest(String gameId,PlayerAction messageDetails) {
        // Check if messageDetails is null
        if (messageDetails == null) {
            ChatMessage message=new ChatMessage("DEALER","Message details should not be empty",LocalDateTime.now());
            chatHistories.get(gameId).add(message);
            return message;
//
        }

        // Check if the demand is null
        if (messageDetails.getDemand() == null) {
            ChatMessage message=new ChatMessage("DEALER","Requested demand should not be empty",LocalDateTime.now());
            chatHistories.get(gameId).add(message);
            return message;

        }

        // Check if chatHistories map contains the gameId and retrieve the list
        List<ChatMessage> chatHistory = chatHistories.get(messageDetails.getGameId());
        if (chatHistory == null) {
            // If the chat history for this gameId does not exist, create a new list and put it in the map
            chatHistory = new ArrayList<>();
            chatHistories.put(messageDetails.getGameId(), chatHistory);
        }

        // Create the message string
        String message = messageDetails.getPlayerName() + " has been requested for the skill "
                + messageDetails.getDemand().skill() + " in the month of "
                + messageDetails.getDemand().time() + ".";

        // Create and add the new ChatMessage to the chat history
        ChatMessage newMessage = new ChatMessage(messageDetails.getPlayerName(), message, LocalDateTime.now());
        chatHistory.add(newMessage); // Now it's safe to add the message

        return newMessage;
    }





    public ChatMessage addingResourceManagerMessage(PlayerAction messageDetails) {
        // Extract demand details
        Demand demand = messageDetails.getDemand();
        String skill = String.valueOf(demand.skill());
        Integer time = demand.time();
        String playerName = messageDetails.getPlayerName();
        String receiverName = messageDetails.getRecieverName();

        String message;

        // Check if skill is present or not
        if (skill == null || skill.isEmpty()) {
            // If skill is not present, construct an alternate message
            message = playerName + " tried to send a skill, but no skill was provided to "
                    + receiverName + ".";
        } else {
            // If skill is present, construct the usual message
            message = playerName + " sent the skill "
                    + skill + " for "
                    + time + " to "
                    + receiverName + ".";
        }

        // Create a new ChatMessage and add it to chat history
        ChatMessage newMessage = new ChatMessage(playerName, message, LocalDateTime.now());
        chatHistories.get(messageDetails.getGameId()).add(newMessage);

        return newMessage;
    }






    public ChatMessage addPlayerAssignmentMessage(DealerAction messageDetails) {

        String gameId = messageDetails.getGameId();
        // Determine the required role based on the player's role
        String requiredRole;
        if (messageDetails.getPlayer().role().equals(Role.PM)) {
            requiredRole = "Project Manager";
        } else {
            requiredRole = "Resource Manager";
        }
        // Create the message to be added to the chat history
        String message = messageDetails.getPlayer().name() + " is assigned as " + requiredRole;

        // Create a new ChatMessage instance
        ChatMessage newMessage = new ChatMessage(messageDetails.getDealerName(), message, LocalDateTime.now());

        // Add the new message to the chat history for the specific game ID
        chatHistories.get(gameId).add(newMessage);

        // Return the newly created message
        return newMessage;
    }



    public ChatMessage addProjectAssignmentMessage(DealerAction messageDetails) {

        String playerName = messageDetails.getPlayer().name();
        // Construct the assignment message
        String projectName = messageDetails.getProject().getName();
        String message = projectName + " project is assigned to " + playerName;
        // Create the ChatMessage object
        ChatMessage newMessage = new ChatMessage(messageDetails.getDealerName(), message, LocalDateTime.now());

        // Add the message to the chat history of the corresponding game
        List<ChatMessage> chatHistory = chatHistories.get(messageDetails.getGameId());
        chatHistory.add(newMessage);
        return newMessage;
    }



}


