package de.itdesign.incubating.rmg.controller;

import de.itdesign.incubating.rmg.model.Game;
import de.itdesign.incubating.rmg.model.Project;
import de.itdesign.incubating.rmg.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.awt.*;
import java.util.List;

@Controller
public class ProjectController {

    private final ProjectService projectservice;

    public ProjectController(ProjectService projectService) {
        this.projectservice = projectService;
    }
    @MessageMapping("/projects")
    @SendTo("/topic/projects")
    public List<Project> getProjects() {
       return projectservice.getProjects();
    }
    // Fetch original projects
    @MessageMapping("/original")
    @SendTo("/topic/original")
    public List<Project> getOriginalProjects() {
        return projectservice.getOriginalProjects();
    }

    // Fetch modified projects
    @MessageMapping("/modified")
    @SendTo("/topic/modified")
    public List<Project> getModifiedProjects() {
        return projectservice.getModifiedProjects();
    }

    // Reset projects
    @MessageMapping("/reset")
    @SendTo("/topic/reset")
    public void resetProjects() {
        projectservice.resetProjects();
    }

    // Move project to modified list
    @MessageMapping("/addProject")
    @SendTo("/topic/addProject")
    public List<Project> moveToModified(Project project) {
        projectservice.moveProjectToModified(project);
        return projectservice.getModifiedProjects(); // Return the updated modified projects list
    }

    // Move project back to original list
    @MessageMapping("/removeProject")
    @SendTo("/topic/removeProject")
    public List<Project> moveToOriginal(String projectId) {
        projectservice.moveProjectToOriginal(projectId); // Call service method with projectId
        return projectservice.getOriginalProjects(); // Return the updated original projects list
    }
}
