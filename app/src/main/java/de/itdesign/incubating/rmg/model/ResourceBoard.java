package de.itdesign.incubating.rmg.model;

import java.util.Collection;
import java.util.UUID;

public class ResourceBoard {
    UUID id;
    String title;
    Player owner;
    Collection<ResourceCard> resources;

    public ResourceBoard(UUID id, String title, Player owner, Collection<ResourceCard> resources) {
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.resources = resources;
    }
    public ResourceBoard() {
        this.id = UUID.randomUUID();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Player getOwner() {
        return owner;
    }

    public void setOwner(Player owner) {
        this.owner = owner;
    }

    public Collection<ResourceCard> getResources() {
        return resources;
    }

    public void setResources(Collection<ResourceCard> resources) {
        this.resources = resources;
    }
}
