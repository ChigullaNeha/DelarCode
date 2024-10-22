package de.itdesign.incubating.rmg.model;

import java.util.List;

public record Player(String id, String name, Role role, List<Integer> scores) { }