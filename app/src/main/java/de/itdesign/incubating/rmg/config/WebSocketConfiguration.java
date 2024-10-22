package de.itdesign.incubating.rmg.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple broker for broadcasting messages to all clients
        config.enableSimpleBroker("/topic");
        // Prefix for client messages that are routed to the message-handling methods in controllers
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Define the WebSocket endpoint where clients connect to
        registry.addEndpoint("/DealerPage").setAllowedOrigins("http://localhost:3000").withSockJS();  // SockJS fallback support
    }
}
