package de.itdesign.incubating.rmg.model;

public class DealerAction {
    String gameId;
    Player player;
    Project project;
    String dealerName;

    public DealerAction(String gameId, Player player, Project project,String dealerName) {
        this.gameId = gameId;
        this.player = player;
        this.project = project;
        this.dealerName = dealerName;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getDealerName() {
        return dealerName;
    }

    public void setDealerName(String dealerName) {
        this.dealerName = dealerName;
    }
}
