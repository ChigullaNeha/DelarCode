//package de.itdesign.incubating.rmg.service;
//
//import de.itdesign.incubating.rmg.model.Game;
//import de.itdesign.incubating.rmg.model.Project;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ProjectService {
//    Game game;
//    ProjectService(){
//        this.game = new Game();
//
//    }
//    public List<Project> getProjects() {
//          List<Project> projects = game.getProjects();
//          System.out.println(projects);
//          return projects;
//    }
//}
package de.itdesign.incubating.rmg.service;

import de.itdesign.incubating.rmg.model.Game;
import de.itdesign.incubating.rmg.model.Project;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {
    private Game game; // Game instance
    private List<Project> originalProjects; // Original projects list
    private List<Project> modifiedProjects; // List for dragged and dropped projects

    public ProjectService() {
        this.game = new Game();
        this.originalProjects = new ArrayList<>(game.getProjects()); // Initialize with original projects
        this.modifiedProjects = new ArrayList<>(game.getProjects()); // Initialize as empty
    }

    // Retrieve the list of original projects -- to get original projects
    public List<Project> getOriginalProjects() {
        System.out.println(originalProjects);
        return originalProjects;
    }

    // Retrieve the list of modified projects -- modified list should be displayed in the projectsList place
    public List<Project> getModifiedProjects() {
        return modifiedProjects;
    }

    // Reset the modified projects list
    public void resetProjects() {
        modifiedProjects.clear(); // Clear the modified projects list
        modifiedProjects.addAll(originalProjects); // Reassign the original projects to the modified list
        System.out.println("Projects have been reset to the original state.");
    }
    // add project
    public void moveProjectToModified(Project project) {
        modifiedProjects.add(project);
    }
   // remove project by project id
    public void moveProjectToOriginal(String projectId) {
        // Find the project by its ID and remove it from the modified list
        modifiedProjects.removeIf(project -> project.getId().equals(projectId));
    }


    // Additional method to get all projects from the game, if needed
    public List<Project> getProjects() {
        return game.getProjects(); // Fetch projects directly from the Game instance
    }
}
