//package de.itdesign.incubating.rmg.gameplay;
//
//import de.itdesign.incubating.rmg.model.*;
//
//import java.util.*;
//
//public class Scoring {
//
//    // Method to calculate the score for a given ProjectManager
//    static int score(ProjectPlan plan) {
//
//        int totalScore = 0;
//        int row = 0;
//        List<Project> project = plan.getProjects();
//        //Collection<Demand> projectDemands = project.getDemands();
//
//        // Maps to count required and available skills
//        Map<Skill, Integer> demandSkills = new HashMap<>();
//        Map<Skill, Integer> availableResources = new HashMap<>();
//
//        // Count the required skills for each demand
//        for (Demand demand : projectDemands) {
//            Skill requiredSkill = demand.skill();
//            demandSkills.put(requiredSkill, demandSkills.getOrDefault(requiredSkill, 0) + 1);
//        }
//
//        // Count the available resources in the project plan
//        for (ResourceCard card : plan.getCards()) {
//            Skill skill = card.skill();
//            availableResources.put(skill, availableResources.getOrDefault(skill, 0) + 1);
//        }
//
//        for (Map.Entry<Skill, Integer> entry : demandSkills.entrySet()) {
//            Skill skill = entry.getKey();
//            int requiredAmount = entry.getValue();
//            int availableAmount = availableResources.getOrDefault(skill, 0);
//
//            if (availableAmount == requiredAmount) {
//                totalScore += 5;
//                row += 1;
//            }
//        }
//
//        if (row == 3) {
//            totalScore = 25;
//        }
//
//        return totalScore;
//    }
//
//    // Method to calculate the score for a given ResourceManager
//    static int score(ResourceBoard board) {
//        int totalScore = 0;
//        Collection<ResourceCard> resources = board.getResources();
//        Map<Integer, Integer> resourceCount = new HashMap<>();
//
//        // Initialize counts for days 2 to 8
//        for (int day = 2; day <= 8; day++) {
//            resourceCount.put(day, 0);
//        }
//
//        // Count resources based on their assigned day
//        for (ResourceCard card : resources) {
//            int day = card.time();
//            resourceCount.put(day, resourceCount.get(day) + 1);
//        }
//
//
//        for (Map.Entry<Integer, Integer> entry : resourceCount.entrySet()) {
//            int day = entry.getKey();
//            int count = entry.getValue();
//
//            if (count == 0) {
//                if (day == 2 || day == 3 || day == 4) {
//                    totalScore += 10;
//                } else {
//                    totalScore += 5;
//                }
//            }
//        }
//
//        return totalScore;
//    }
//
//    // Method to calculate scores for all players in a given game and update the game data
//    static void score(Game game) {
//
//        Collection<Player> players = game.getPlayers();
//        Collection<ProjectPlan> projectPlans = game.getProjectPlans();
//        Collection<ResourceBoard> resourceBoards = game.getResourceBoards();
//        List<Player> updatedPlayers = new ArrayList<>();
//
//        // Iterate through each player to calculate their total score
//        for (Player player : players) {
//            int playerScore = 0;
//
//            // Calculate score from project plans owned by the player
//            for (ProjectPlan plan : projectPlans) {
//                if (plan.getOwner().equals(player)) {
//                    playerScore += score(plan);
//                }
//            }
//
//            // Calculate score from resource boards owned by the player
//            for (ResourceBoard board : resourceBoards) {
//                if (board.getOwner().equals(player)) {
//                    playerScore += score(board);
//                }
//            }
//
//            List<Integer> updatedScore = new ArrayList<>(player.scores());
//            updatedScore.add(playerScore);
//
//            Player updatedPlayer = new Player(player.id(), player.role(), player.name(), updatedScore);
//
//            updatedPlayers.add(updatedPlayer);
//
//        }
//
//        // Set the updated player list back into the game
//        game.setPlayers(updatedPlayers);
//
//    }
//
//}