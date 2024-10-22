package de.itdesign.incubating.rmg.model;

public class PlayerAction {
    String gameId;
    String playerName;
    Demand demand;
    String recieverName;

    public PlayerAction(String playerName, Demand demand, String gameId, String recieverName) {
        this.playerName = playerName;
        this.demand = demand;
        this.gameId = gameId;
        this.recieverName = recieverName;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public Demand getDemand() {
        return demand;
    }

    public void setDemand(Demand demand) {
        this.demand = demand;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getRecieverName() {
        return recieverName;
    }

    public void setRecieverName(String recieverName) {
        this.recieverName = recieverName;
    }
}
