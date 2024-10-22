package de.itdesign.incubating.rmg.service;

import de.itdesign.incubating.rmg.model.Player;
import de.itdesign.incubating.rmg.model.ResourceBoard;
import org.springframework.stereotype.Service;

@Service
public class ResourceBoardService {
    private ResourceBoard resourceManagerOne = new ResourceBoard();
    private ResourceBoard resourceManagerTwo = new ResourceBoard();
    // Method to set the owner for ResourceManagerOne
    public void setOwnerForResourceManagerOne(Player owner) {
        resourceManagerOne.setOwner(owner);
    }

    // Method to set the owner for ResourceManagerTwo
    public void setOwnerForResourceManagerTwo(Player owner) {
        resourceManagerTwo.setOwner(owner);
    }

    // Method to remove the owner from ResourceManagerOne
    public void removeOwnerFromResourceManagerOne() {
        resourceManagerOne.setOwner(null);
    }

    // Method to remove the owner from ResourceManagerTwo
    public void removeOwnerFromResourceManagerTwo() {
        resourceManagerTwo.setOwner(null);
    }
    // Method to get RMOne
    public ResourceBoard getResourceManagerOne() {
        return resourceManagerOne;
    }
    // Method to get RMTwo
    public ResourceBoard getResourceManagerTwo() {
        return resourceManagerTwo;
    }
    // Method to reset resource manager one
    public void resetRMOneList() {
        resourceManagerOne.setOwner(null);
    }
    // Method to reset resource manager two
    public void resetRMTwoList() {
        resourceManagerTwo.setOwner(null);
    }
}
