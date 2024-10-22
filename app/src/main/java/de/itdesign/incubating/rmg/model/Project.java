package de.itdesign.incubating.rmg.model;

import java.util.Collection;

public class Project {
    String id;
    final String name;
    final int initialStartTime, initialFinishTime;
    Collection<Demand> demands;

    public Project(String id, String name, int initialStartTime, int initialFinishTime, Collection<Demand> demands) {
        this.name = name;
        this.initialStartTime = initialStartTime;
        this.initialFinishTime = initialFinishTime;
        this.id = id;
        this.demands = demands;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public int getInitialStartTime() {
        return initialStartTime;
    }

    public int getInitialFinishTime() {
        return initialFinishTime;
    }

    public Collection<Demand> getDemands() {
        return demands;
    }

    public void setDemands(Collection<Demand> demands) {
        this.demands = demands;
    }
}
