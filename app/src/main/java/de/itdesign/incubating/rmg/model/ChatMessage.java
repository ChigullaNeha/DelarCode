package de.itdesign.incubating.rmg.model;


import java.time.LocalDateTime;
import java.util.Date;

public class ChatMessage {

    private String sender;
    private String message;
    private LocalDateTime dateTime;

    public ChatMessage(String sender, String message, LocalDateTime dateTime) {
        this.sender = sender;
        this.message = message;
        this.dateTime = dateTime;
    }


// Getters and setters


    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDateTime() {

        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }


}
