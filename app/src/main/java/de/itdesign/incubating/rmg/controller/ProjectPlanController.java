package de.itdesign.incubating.rmg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.Project;
import de.itdesign.incubating.rmg.model.ProjectPlan;
import de.itdesign.incubating.rmg.service.ProjectPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Map;

@RestController
public class ProjectPlanController {

    private final ProjectPlanService projectPlanService;
    @Autowired
    public ProjectPlanController(ProjectPlanService projectPlanService) {
        this.projectPlanService = projectPlanService;
    }
    @MessageMapping("/addPlayerToPMList")
    @SendTo("/topic/project-plans")
    public ProjectPlan addPlayerToPMLists(@Payload Map<String, Object> payload) {
        int firstIndex = (int) payload.get("firstIndex");
        int secondIndex = (int) payload.get("secondIndex");
        Player player = new ObjectMapper().convertValue(payload.get("player"), Player.class);

        projectPlanService.addPlayerToPMLists(firstIndex, secondIndex, player);
        projectPlanService.projectStarted();
        // Return the updated ProjectPlan data as a Map
        return projectPlanService.getPMList(firstIndex);
    }

    @MessageMapping("/setProject")
    @SendTo("/topic/project-plans")
    public ProjectPlan setProjectToPMList(int index, Project project) {
        projectPlanService.setProjectToPMList(index, project);
        return projectPlanService.getPMList(index);
    }

    @MessageMapping("/removePlayer")
    @SendTo("/topic/project-plans")
    public ProjectPlan removePlayerFromPMLists(int firstIndex, int secondIndex) {
        projectPlanService.removePlayerFromPMLists(firstIndex, secondIndex);
        return projectPlanService.getPMList(firstIndex);
    }

    @MessageMapping("/PMList/removeProject")
    @SendTo("/topic/project-plans")
    public ProjectPlan removeProjectFromPMList(int index) {
        projectPlanService.removeProjectFromPMList(index);
        return projectPlanService.getPMList(index);
    }

    @MessageMapping("/reset/pms")
    @SendTo("/topic/project-plans")
    public ProjectPlan resetPMList(int index) {
        projectPlanService.resetPMList(index);
        return projectPlanService.getPMList(index);
    }

    @MessageMapping("/getPMList")
    @SendTo("/topic/project-plans")
    public ProjectPlan getPMList(int index) {
        return projectPlanService.getPMList(index);
    }

    //dfgdfgfag

    @GetMapping("/games/projectPlansList")
    public Collection<ProjectPlan> getProjectP(){
        return projectPlanService.getProjectList();
    }

    @GetMapping("/getpps")
    public Collection<ProjectPlan> getProjectPlans() {
        return projectPlanService.getProjectPlans();
    }
}
