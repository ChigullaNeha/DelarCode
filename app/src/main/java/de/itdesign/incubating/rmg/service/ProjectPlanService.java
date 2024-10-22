package de.itdesign.incubating.rmg.service;

import de.itdesign.incubating.rmg.model.Game;
import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.Project;
import de.itdesign.incubating.rmg.model.ProjectPlan;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProjectPlanService {
    private final List<ProjectPlan> projectPlanLists = new ArrayList<>();
    private final Game newGame = new Game();


    // changed
    public Collection<ProjectPlan> getProjectList(){
        return  newGame.getProjectPlans();
    }

    // Constructor to initialize the list with the required number of ProjectPlan instances
    public ProjectPlanService() {
        for (int i = 0; i < 6; i++) {
            projectPlanLists.add(new ProjectPlan());
        }
    }
    public void addPlayerToPMLists(int firstIndex, int secondIndex, Player player) {
        if (isValidIndex(firstIndex) && isValidIndex(secondIndex)) {
            if (projectPlanLists.get(firstIndex).getOwner() == null && projectPlanLists.get(secondIndex).getOwner() == null) {
                projectPlanLists.get(firstIndex).setOwner(player);
                projectPlanLists.get(secondIndex).setOwner(player);
                newGame.setProjectPlan(projectPlanLists);
                System.out.println(player + " added to PM lists " + firstIndex + " and " + secondIndex);
            } else {
                System.out.println("Player already set at indices " + firstIndex + " or " + secondIndex + ". No player added.");
            }
        }
    }
    // Method to add a project to a specified PM list
    public void setProjectToPMList(int index, Project project) {
        if (isValidIndex(index) && projectPlanLists.get(index).getOwner() != null) {
            projectPlanLists.get(index).setProject(project);
            newGame.setProjectPlan(projectPlanLists);
        }
    }
    // Method to remove a player from the specified PM lists
    public void removePlayerFromPMLists(int firstIndex, int secondIndex) {
        if (isValidIndex(firstIndex) && isValidIndex(secondIndex)) {
            projectPlanLists.get(firstIndex).setOwner(null);
            projectPlanLists.get(secondIndex).setOwner(null);
            newGame.setProjectPlan(projectPlanLists);
        }
    }
    // Method to remove a project from a specified PM list
    public void removeProjectFromPMList(int index) {
        if (isValidIndex(index)) {
            projectPlanLists.get(index).setProject(null);
            newGame.setProjectPlan(projectPlanLists);
        }
    }

    // Method to reset a specified PM list
    public void resetPMList(int index) {
        if (isValidIndex(index)) {
            projectPlanLists.get(index).setOwner(null);
            projectPlanLists.get(index).setProject(null);
            newGame.setProjectPlan(projectPlanLists);
        }
    }

    // Method to get a specified PM list
    public ProjectPlan getPMList(int index) {
        if (isValidIndex(index)) {
            Map<String, Object> result = new HashMap<>();
            result.put("index", index);
            result.put("projectPlan", projectPlanLists.get(index));
            return new ArrayList<ProjectPlan>(newGame.getProjectPlans()).get(index);
        }
        return null;
    }
    public void projectStarted() {
        newGame.setProjectPlan(projectPlanLists);
    }
    // Helper method to check if the index is valid
    private boolean isValidIndex(int index) {
        return index >= 0 && index < projectPlanLists.size();
    }

    public Collection<ProjectPlan> getProjectPlans() {
        return newGame.getProjectPlans();
    }

}
