package de.itdesign.incubating.rmg.dto;

import de.itdesign.incubating.rmg.model.Player;

public class GameCreator {
    private Player dealer;
    private String inviteUrl;
    private String gameId;

    public GameCreator(Player dealer, String inviteUrl, String gameId) {
        this.dealer = dealer;
        this.inviteUrl = inviteUrl;
        this.gameId = gameId;
    }

    public Player getDealer() {
        return dealer;
    }

    public void setDealer(Player dealer) {
        this.dealer = dealer;
    }

    public String getInviteUrl() {
        return inviteUrl;
    }

    public void setInviteUrl(String inviteUrl) {
        this.inviteUrl = inviteUrl;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }
}
