package de.itdesign.incubating.rmg.controller;

import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.ResourceBoard;
import de.itdesign.incubating.rmg.service.ResourceBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ResourceBoardController {

    @Autowired
    private ResourceBoardService resourceBoardService;

    // Method to set the owner for ResourceManagerOne
    @MessageMapping("/setOwnerForResourceManagerOne")
    @SendTo("/topic/resourceManagerOne")
    public String setOwnerForResourceManagerOne(Player owner) {
        resourceBoardService.setOwnerForResourceManagerOne(owner);
        return "Owner set for ResourceManagerOne: " + owner.name();
    }

    // Method to set the owner for ResourceManagerTwo
    @MessageMapping("/setOwnerForResourceManagerTwo")
    @SendTo("/topic/resourceManagerTwo")
    public String setOwnerForResourceManagerTwo(Player owner) {
        resourceBoardService.setOwnerForResourceManagerTwo(owner);
        return "Owner set for ResourceManagerTwo: " + owner.name();
    }

    // Method to remove the owner from ResourceManagerOne
    @MessageMapping("/removeOwnerFromResourceManagerOne")
    @SendTo("/topic/resourceManagerOne")
    public String removeOwnerFromResourceManagerOne() {
        resourceBoardService.removeOwnerFromResourceManagerOne();
        return "Owner removed from ResourceManagerOne";
    }

    // Method to remove the owner from ResourceManagerTwo
    @MessageMapping("/removeOwnerFromResourceManagerTwo")
    @SendTo("/topic/resourceManagerTwo")
    public String removeOwnerFromResourceManagerTwo() {
        resourceBoardService.removeOwnerFromResourceManagerTwo();
        return "Owner removed from ResourceManagerTwo";
    }
    // Method to get ResourcBoardOne
    @MessageMapping("/getResourceManagerOne")
    @SendTo("/topic/getResourceManagerOne")
    public ResourceBoard getResourceManagerOne() {
        return resourceBoardService.getResourceManagerOne();
    }
    // Method to get ResourceBoardTwo
    @MessageMapping("/getResourceManagerTwo")
    @SendTo("/topic/getResourceManagerTwo")
    public ResourceBoard getResourceManagerTwo() {
        return resourceBoardService.getResourceManagerTwo();
    }
    // Method to reset rm one list
    @MessageMapping("/resetRMOneList")
    @SendTo("/topic/resetRMOneList")
    public void resetRMOneList() {
        resourceBoardService.resetRMOneList();
    }
    // Method to reset rm two list
    @MessageMapping("/resetRMTwoList")
    @SendTo("/topic/resetRMTwoList")
    public void resetRMTwoList() {
        resourceBoardService.resetRMTwoList();
    }
}
