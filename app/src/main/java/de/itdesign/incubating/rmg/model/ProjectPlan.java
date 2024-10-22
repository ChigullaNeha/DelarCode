package de.itdesign.incubating.rmg.model;
import java.util.Collection;
import java.util.UUID;

public class ProjectPlan {
    private UUID id;
    private Player owner;
    private Project project;
    private int projectStartTime;
    private Collection<ResourceCard> cards;

    public ProjectPlan(Player owner, int projectStartTime,Project project, Collection<ResourceCard> cards) {
        this.owner = owner;
        this.project = project;
        this.projectStartTime = projectStartTime;
        this.cards = cards;
    }

    // Default constructor
    public ProjectPlan() {
        this.id = UUID.randomUUID();
    }
    // Getters and setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Player getOwner() {
        return owner;
    }

    public void setOwner(Player owner) {
        this.owner = owner;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public int getProjectStartTime() {
        return projectStartTime;
    }

    public void setProjectStartTime(int projectStartTime) {
        this.projectStartTime = projectStartTime;
    }

    public Collection<ResourceCard> getCards() {
        return cards;
    }

    public void setCards(Collection<ResourceCard> cards) {
        this.cards = cards;
    }
}