package de.itdesign.incubating.rmg.config;


import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // Store active WebSocket sessions
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    // When a new WebSocket connection is established
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        // Optionally notify other players about the new connection
    }

    // When a message is received from a client
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String receivedMessage = message.getPayload();
        System.out.println("Received message: " + receivedMessage + " from: " + session.getId());

        // Broadcast the message to all connected sessions
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(receivedMessage)); // Echoing the message to all clients
            }
        }
    }

    // When a WebSocket connection is closed
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket connection closed: " + session.getId() + ", Status: " + status);
        // Perform additional cleanup actions if needed, such as notifying other players

    }

    // Handle any errors that occur during WebSocket communication
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("Error in WebSocket session " + session.getId() + ": " + exception.getMessage());
        session.close(CloseStatus.SERVER_ERROR);
        sessions.remove(session);

    }


}



