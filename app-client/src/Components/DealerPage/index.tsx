import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';
import Player from '../Player';

interface Player {
  id: string;
  name: string;
  role: string; 
  scores: number[];
}
interface Project {
  demands: string[],
  id: string,
  name: string,
  initialFinishTime: number,
  initialStartTime: number,
}
interface DragItem {
  id: string; 
  typeOfList: 'first' | 'second' | 'third' | 'rmOne' | 'rmTwo';
  type: string;
}
const PlayerItem = ({ player, typeOfList }: { player: Player, typeOfList: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLAYER',
    item: { id: player.id, type: 'PLAYER', typeOfList },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [player.id]);
  return (
    <h4 ref={drag}  style={{fontFamily: 'sans-serif'}} className='each-player' key={player.id}>
      {player.name}
    </h4>
  );
};
const PlayerItems = ({ player, typeOfList }: { player: Player, typeOfList: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLAYER',
    item: { id: player.id, type: 'PLAYER', typeOfList },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [player.id]);

  return (
    <h4 ref={drag}  style={{fontFamily: 'sans-serif'}} className='drop-player' key={player.id}>
      {player.name}
    </h4>
  );
};
const ProjectItem = ({ project }: { project: Project }) => {
  const [{ isDragging }, dragPro] = useDrag(() => ({
    type: 'PROJECT',
    item: { id: project.id, type: 'PROJECT' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [project.id]);

  return (
    <h4 ref={dragPro}  style={{fontFamily: 'sans-serif'}} className='each-project' key={project.id}>
      {project.name}
    </h4>
  );
};

let projectPlans={
  projectPlan1:{
  },
  projectPlan2:{}
  ,
  projectPlane3:{}
}

const DealerPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const playersRef = useRef<Player[]>([]);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modifiedProjects, setModifiedProjects] = useState([]);
  const [firstList, setFirstList] = useState(new Array(3));
  const [secondList, setSecondList] = useState(new Array(3));
  const [thirdList, setThirdList] = useState(new Array(3));
  const [RMOneList, setRMOneList] = useState(new Array(1));
  const [RMTwoList, setRMTwoList] = useState(new Array(1));
  const [FPMList, setFPMList] = useState({id: null,owner: null,projects: []});
const [SPMList, setSPMList] = useState({id: null,owner: null,projects: []});
const [THRDMList, setTHRDMList] = useState({id: null,owner: null,projects: []});

  const [ResourceManagerOneList, setResourceManagerOne] = useState([]);
  const [ResourceManagerTwoList, setResourceManagerTwo] = useState([]);
  const [count, setCount] = useState(0);
  const [livePlayers, setPlayersData] = useState([]);
  const [newplayersList, setNewPlayersList] = useState([]);
  const [newPlayersCopy, setNewPlayersCopy] = useState([]);
  const [stompClient, setStompClient] = useState<Client| null>(null);
  const [dealer, setDealer] = useState([]);
  const { gameId } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [isStartGameButtonClicked, setStartBtnClicked] = useState();
  const navigate = useNavigate();
  const [fpmlist, setfpmlist] = useState({id: null,owner: null});
  const [spmlist, setspmlist] = useState({id: null,owner: null,projects: []});
  const [thrdpmlist, setthrdpmlist] = useState({id: null,owner: null,projects: []});
  const [refresh, setRefresh] = useState(false);



  useEffect(() => {
    const serverUrl = 'http://localhost:8080/game';
    const fetchPlayersData = async () => {
      const response = await fetch(`${serverUrl}/${gameId}/players`);
      const data = await response.json();
      setPlayersData(data);
      setDealer(data.slice(0,1));
      setNewPlayersList(data.slice(1, data.length));
    };
    const getpps = async() => {
      const url = 'http://localhost:8080/getpps';
      const response = await fetch(url);
      const data = await response.json();
      setfpmlist(data[0])
      setspmlist(data[2])
      setthrdpmlist(data[4])
      
      console.log(data, "project planssss");
    }
    if (!sessionStorage.getItem('reloaded')) {
      setRefresh(true);
      sessionStorage.setItem('reloaded', 'true');
    }
    // Socket Initialization
    const socket = new SockJS("http://localhost:8080/DealerPage");
    // Stomp Client Initialization
    const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            console.log("Connected to WebSocket");
            // Subscribe to the players topic
            stompClient.subscribe("/topic/players", (message) => {
                const gameData = JSON.parse(message.body);
                  setPlayers(gameData);             
            });
            // Publish to the /app/players endpoint
            stompClient.publish({
                destination: "/app/players"
            });
            // get live players
            stompClient.subscribe("/topic/originalPlayers", (message) => {
              const data = JSON.parse(message.body);
              console.log(data, "OriginalPlayers");
            })
            stompClient.publish({
              destination: "/app/players/original",
              body: gameId
            })
           // to get original list
            stompClient.subscribe("/topic/original", (message) => {
              const gameData = JSON.parse(message.body);
                 console.log(gameData, "Original Projects List");
          });
          // Publish to the /app/players endpoint
          stompClient.publish({
              destination: "/app/original"
          });
          // get live players copy
          stompClient.subscribe("/topic/modifiedPlayers", (message) => {
            const playersCopyy = JSON.parse(message.body);
            console.log(playersCopyy, "players copy");
            setNewPlayersCopy(playersCopyy.slice(1,playersCopyy.length));
          })
          stompClient.publish({
            destination: "/app/players/modified"
          })
          // add project to the projects list
          stompClient.subscribe("/topic/addProject", () => {
          });
          // reset players
          stompClient.subscribe("/topic/reset/players", () => {})
          // reset projects
          stompClient.subscribe("/topic/reset", () => {})
          // reset rm one list
          stompClient.subscribe("/topic/resetRMOneList", () => {})
          // reset rm two list
          stompClient.subscribe("/topic/resetRMTwoList", () => {})
          // 
          // modified projects
          stompClient.subscribe("/topic/modified", (message) => {
            const gameData = JSON.parse(message.body);
              setModifiedProjects(gameData);
              setProjects(gameData);
        }); 
        stompClient.publish({
            destination: "/app/modified"
        });
        // remove project from project's list
        stompClient.subscribe("/topic/removeProject", (message) => {
          const gameData = JSON.parse(message.body);
          console.log("remove project called")
          // console.log(gameData, "projects after modification");
      });
      // Subscribe to the projects topic
      stompClient.subscribe("/topic/projects", (message) => {
        const projectData = JSON.parse(message.body);
        // setProjects(projectData);
        // console.log("Received Projects: ", projectData);
      });
      stompClient.publish({
          destination: "/app/projects"
      });      
       // add player to rm one list
       stompClient.subscribe("/topic/resourceManagerOne", (message) => {
        console.log(message.body, "player added to rm one list");
       })
       // add player to rm two list
       stompClient.subscribe("/topic/resourceManagerTwo", (message) => {
        console.log(message, "player added to rom two list")
       })
       // get Resource Manager One List
       stompClient.subscribe("/topic/getResourceManagerOne", (message) => {
        const rmoneList = JSON.parse(message.body);
        setResourceManagerOne(rmoneList);
       })
       stompClient.publish({
        destination: "/app/getResourceManagerOne",
       })
       // get Resource Manager Two List
       stompClient.subscribe("/topic/getResourceManagerTwo", (message) => {
        const rmTwoList = JSON.parse(message.body);
        setResourceManagerTwo(rmTwoList);
       })
       stompClient.publish({
        destination: "/app/getResourceManagerTwo",
       })
       // add player to players copy
       stompClient.subscribe("/topic/addPlayerToPlayersCopy", () => {
        console.log("player added to modified list");
       })
       // remove player from player's list
        stompClient.subscribe("/topic/remove/player", () => {
          console.log("player removed from player's list");
        })
        stompClient.subscribe("/topic/project-plans", (message) => {
          const pmsdata = JSON.parse(message.body);
           console.log(pmsdata, `pms data at index ${pmsdata.index}`);
          //  setfpmlist(pmsdata);
          })
        },
        onStompError: (frame) => {
            console.error("Broker Error: " + frame.headers["message"]);
        },
    });
    fetchPlayersData();
    getpps();
    setStompClient(stompClient);
    stompClient.activate();
    return () => {
        stompClient.deactivate();
    };
    
}, []);
const removeProject = (id: string) => {
    // const stompClient = stompClientRef.current; // Get the current client
    if (!stompClient) {
        console.error("STOMP client is not initialized");
        return;
    }
    stompClient.publish({
        destination: "/app/removeProject",
        body: id,
    });
}
if (refresh) {
  setRefresh(false); // Reset refresh state after initial rendering
}
// used to add project in the projects list
const addProject = (project: Project) => {
  // Check if the stompClient is initialized
  if (!stompClient) {
      console.error("STOMP client is not initialized");
      return; // Exit the function if the client is not initialized
  }
  // Publish the project to the backend
  stompClient.publish({
      destination: "/app/addProject",
      body: JSON.stringify(project),
  });
};
// method to handle reset actions
const resetGame = () => {
  setCount(count + 1);
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return; 
  }
  
  stompClient.publish({
    destination: "/app/players/resetModified",
  });
  setCount(count + 1);
  stompClient.publish({
    destination: "/app/resetFirstPMList"
  })
  setCount(count + 1);
  stompClient.publish({
    destination: "/app/resetSecondPMList"
  })
  stompClient.publish({
    destination: "/app/resetThirdPMList"
  })
  setCount(count + 1);
  stompClient.publish({
    destination: "/app/reset"
  })
  setCount(count + 1);
  stompClient.publish({
    destination: "/app/resetRMOneList"
  })
  setCount(count + 1);
  stompClient.publish({
    destination: "/app/resetRMTwoList"
  })
  setCount(count + 1);
}
 // add player to resouce manager one 
 const addPlayerToRMOne = (player: Player) => {
  setCount(count + 1);
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return; 
  }
  // Publish the player to be added
  stompClient.publish({
    destination: "/app/setOwnerForResourceManagerOne",
    body: JSON.stringify(player),
  });
 }
 // remove player from resource manager one 
 const removePlayerFromResourceManagerOne = () => {
  setCount(count + 1);
    if (!stompClient) {
      console.error("STOMP client is not initialized");
      return;
    }
    stompClient.publish({
      destination: "/app/removeOwnerFromResourceManagerOne",
    });
 }
 // add player to resource manager two
 const addPlayerToRMTwo = (player: Player) => {
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return; 
  }
  // Publish the player to be added
  stompClient.publish({
    destination: "/app/setOwnerForResourceManagerTwo",
    body: JSON.stringify(player),
  });
 }
 // remove player from second rm 
 const removePlayerFromResourceManagerTwo = () => {
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return;
  }
  stompClient.publish({
    destination: "/app/removeOwnerFromResourceManagerTwo",
  });
 }
// add player into player's list
const addPlayer = (player: Player) => {
  setCount(count + 1);
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return; 
  }
  // Publish the player to be added
  stompClient.publish({
    destination: "/app/players/addToModified",
    body: JSON.stringify(player),
  });
}
// remove player from player's list
const removePlayer = (id: string) => {
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return;
  }
  stompClient.publish({
    destination: "/app/players/removeFromModified",
    body: id
  });
}
// add player to pm list's
const addPlayerToPMLists = (player: Player, firstIndex: number, secondIndex: number) => {
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return; 
  }
  stompClient.publish({
    destination: "/app/addPlayerToPMList",
    body: JSON.stringify({ firstIndex: 0, secondIndex: 1, player: player }),
  });
}
// get pm's data
const getData = (index: number) => {
  if (!stompClient) {
    console.error("STOMP client is not initialized");
    return; 
  }
  stompClient.publish({
    destination: "/app/getPMList",
    body: JSON.stringify(index),
  });
}
const handleDrop = (
  listSetter: React.Dispatch<React.SetStateAction<Player[]>>,
  id: string
) => {
  setCount(count + 1);
  const newPlayer = newPlayersCopy.find((each) => each.id === id);
  if (newPlayer) {
    setPlayers((prevPlayers) => {
      return prevPlayers.filter((each) => each.id !== id);
    });
    setCount(count + 1);
    listSetter(() => {
        if (listSetter === setFirstList) {
          if (fpmlist.owner === null) {
            setCount(count + 1);
            // addPlayerToFPMList(newPlayer);
            // addPlayerToFirstSecondPMList(newPlayer);
            addPlayerToPMLists(newPlayer,0,1);
            getData(0);
           
            removePlayer(id);
          }
        } else if (listSetter === setSecondList) {
          if (spmlist.owner === null) {
            // addPlayerToSecondPMList(newPlayer);
            // addPlayerToThirdFourthPMList(newPlayer);
            addPlayerToPMLists(newPlayer,2,3);
            getData(2);
            removePlayer(id);
            setCount(count + 1);
          }
        } else if (listSetter === setThirdList) {
          if (thrdpmlist.owner === null) {
            // addPlayerToThirdPMList(newPlayer);
            // addPlayerToFifthSixthPMList(newPlayer);
            addPlayerToPMLists(newPlayer,4,5);
            getData(4);
            removePlayer(id);
            setCount(count + 1);
          }
        } else if (listSetter === setRMOneList) {
          if (ResourceManagerOneList.owner === null) {
            addPlayerToRMOne(newPlayer);
            removePlayer(id);
            setCount(count + 1);
          }
        } else if (listSetter === setRMTwoList) {
          if (ResourceManagerTwoList.owner === null) {
            addPlayerToRMTwo(newPlayer);
            removePlayer(id);
            setCount(count + 1);
          }
        }
        return [newPlayer];
    });
    setCount(count + 1);
    // const messageDetails = {
    //   gameId,
    //   player: newPlayer,
    //   dealerName: dealer,
    // }
    // if (!stompClient) {
    //   console.error("STOMP client is not initialized");
    //   return; 
    // }
    // stompClient.publish({
    //   destination: `/app/dealerAction/${gameId}`,
    //   body: JSON.stringify(messageDetails)
    // })
  }
  setCount(count + 1);
};

const handleProjectsToDrop = (
  listSetter: React.Dispatch<React.SetStateAction<(Player | Project)[]>>,
  id: string
) => {
  const newProject = projects.find((each) => each.id === id);
  if (newProject) {
    listSetter((prevList) => {
      console.log("Previous List:", prevList);
      console.log("New Project to Add:", newProject);
      const firstItem = prevList[0];
      if (!firstItem) {
        console.log("No player set at index [0], cannot add projects.");
        return prevList;
      }
      if (!prevList[1]) {
        console.log("Adding project to index [1]");
        if (listSetter === setFirstList && FPMList.owner !== null) {
          addProjectToFirstPMList(newProject);
          removeProject(id);
          const messageDetails = {
            gameId,
            player: FPMList.owner,
            dealerName: dealer,
            project: newProject,
          }
          if (!stompClient) {
            console.error("STOMP client is not initialized");
            return; 
          }
          stompClient.publish({
            destination: `/app/dealerAction/${gameId}`,
            body: JSON.stringify(messageDetails)
          })
        } else if (listSetter === setSecondList && FPMList.owner !== null) {
          addProjectToSecondPMList(newProject);
          removeProject(id);
          const messageDetails = {
            gameId,
            player: SPMList.owner,
            dealerName: dealer,
            project: newProject,
          }
          if (!stompClient) {
            console.error("STOMP client is not initialized");
            return; 
          }
          stompClient.publish({
            destination: `/app/dealerAction/${gameId}`,
            body: JSON.stringify(messageDetails)
          })
        } else if (listSetter === setThirdList && FPMList.owner !== null) {
          addProjectToThirdPMList(newProject);
          removeProject(id);
          const messageDetails = {
            gameId,
            player: THRDMList.owner,
            dealerName: dealer,
            project: newProject,
          }
          if (!stompClient) {
            console.error("STOMP client is not initialized");
            return; 
          }
          stompClient.publish({
            destination: `/app/dealerAction/${gameId}`,
            body: JSON.stringify(messageDetails)
          })
        }
        setCount(count + 1);
        const newList = [prevList[0], newProject];
        console.log("Updated List after adding to [1]:", newList);
        const updatedProjects = projects.filter((project) => project.id !== id);
        setProjects(updatedProjects);
        return newList;
      }
      if (!prevList[2]) {
        console.log("Adding project to index [2]");
        if (listSetter === setFirstList && FPMList.owner !== null) {
          addProjectToFirstPMList(newProject);
          removeProject(id);
          const messageDetails = {
            gameId,
            player: FPMList.owner,
            dealerName: dealer,
            project: newProject,
          }
          if (!stompClient) {
            console.error("STOMP client is not initialized");
            return; 
          }
          stompClient.publish({
            destination: `/app/dealerAction/${gameId}`,
            body: JSON.stringify(messageDetails)
          })
        } else if (listSetter === setSecondList && SPMList.owner !== null) {
          addProjectToSecondPMList(newProject);
          removeProject(id);
          const messageDetails = {
            gameId,
            player: SPMList.owner,
            dealerName: dealer,
            project: newProject,
          }
          if (!stompClient) {
            console.error("STOMP client is not initialized");
            return; 
          }
          stompClient.publish({
            destination: `/app/dealerAction/${gameId}`,
            body: JSON.stringify(messageDetails)
          })
        } else if (listSetter === setThirdList && THRDMList.owner !== null) {
          addProjectToThirdPMList(newProject);
          removeProject(id);
          const messageDetails = {
            gameId,
            player: THRDMList.owner,
            dealerName: dealer,
            project: newProject,
          }
          if (!stompClient) {
            console.error("STOMP client is not initialized");
            return; 
          }
          stompClient.publish({
            destination: `/app/dealerAction/${gameId}`,
            body: JSON.stringify(messageDetails)
          })
        }
        setCount(count + 1);
        const newList = [prevList[0], prevList[1], newProject];
        const updatedProjects = projects.filter((project) => project.id !== id);
        setProjects(updatedProjects);
        return newList;
      }
      console.log("Both project slots [1] and [2] are already filled.");
      return prevList;
    });

    console.log("Project dropped and processed:", id);
  } else {
    console.log("Project not found.");
  }
  setCount(count + 1);
};
const areAllRolesAssigned = () => {
  return (
    FPMList.owner !== null &&
    SPMList.owner !== null &&
    THRDMList.owner !== null &&
    ResourceManagerOneList.owner !== null &&
    ResourceManagerTwoList.owner !== null
  );
};
 // Function to handle starting the game
 const handleStartGame = () => {
  if (!areAllRolesAssigned()) {
    setShowPopup(true);
    
  } else {
    console.log('Game started!');
    setStartBtnClicked(true);
  }
};
  const [, drop] = useDrop({
    accept: ['PLAYER', 'PROJECT'], 
    drop: (item: DragItem) => {
      if (item.type === 'PLAYER') {
        handleDrop(setFirstList, item.id);
        setCount(count + 1);
      } else if (item.type === 'PROJECT') {
        // console.log("Dropped project with ID:", item.id);
        handleProjectsToDrop(setFirstList, item.id);
      }
      setCount(count + 1);
    },
    
  });
  const [, dropPM2] = useDrop({
    accept: ['PLAYER', 'PROJECT'], 
    drop: (item: DragItem) => {
      if (item.type === 'PLAYER') {
        handleDrop(setSecondList, item.id); 
      } else if (item.type === 'PROJECT') {
        console.log("Dropped project with ID:", item.id);
        handleProjectsToDrop(setSecondList, item.id);
      }
    },
  });
  const [, dropPM3] = useDrop({
    accept: ['PLAYER', 'PROJECT'], 
    drop: (item: DragItem) => {
      if (item.type === 'PLAYER') {
        handleDrop(setThirdList, item.id); 
      } else if (item.type === 'PROJECT') {
        console.log("Dropped project with ID:", item.id);
        handleProjectsToDrop(setThirdList, item.id);
      }
    },
  });
  const [, dropRM1] = useDrop({
    accept: ['PLAYER', 'PROJECT'], 
    drop: (item: DragItem) => {
      if (item.type === 'PLAYER') {
        handleDrop(setRMOneList, item.id); 
      } else if (item.type === 'PROJECT') {
        console.log("Dropped project with ID:", item.id);
      }
    },
  });
  const [, dropRM2] = useDrop({
    accept: ['PLAYER', 'PROJECT'], 
    drop: (item: DragItem) => {
      if (item.type === 'PLAYER') {
        handleDrop(setRMTwoList, item.id); 
      } else if (item.type === 'PROJECT') {
        console.log("Dropped project with ID:", item.id);
      }
    },
  });
  const [, dropP] = useDrop({
    accept: 'PLAYER',
    drop: (item) => {
      let player;
      switch (item.typeOfList) {
        case 'first':
          player = Object.values(FPMList).find(p => p.id === item.id);
          if (player) {
            if (player.role === 'EMPLOYEE') {
              setSecondList(prev => {
                const newList = [...prev];
                return newList;
              });
              if (FPMList.projects && FPMList.projects.length > 0) {
                Promise.all(
                  FPMList.projects.map(async (pro) => {
                    try {
                      await addProject(pro);
                      console.log(`Project ${pro.id} added successfully.`);
                    } catch (error) {
                      console.error(`Failed to add project ${pro.id}:`, error);
                    }
                  })
                ).then(() => {
                  console.log("All projects have been processed.");
                });
              }
              removePlayerFromFPMList(player.id);
              addPlayer(player);
              setCount(count + 1);
              handlePlayerDrop(player);
            } else {
              console.warn(`Player with ID ${item.id} does not have the 'PLAYER' role. Drop ignored.`);
            }
          }
          break;
        case 'second':
          player = Object.values(SPMList).find(p => p.id === item.id);
          if (player) {
            if (player.role === 'EMPLOYEE') {
              setSecondList(prev => {
                const newList = [...prev];
                return newList;
              });
              if (SPMList.projects && SPMList.projects.length > 0) {
                Promise.all(
                  SPMList.projects.map(async (pro) => {
                    try {
                      await addProject(pro);
                      console.log(`Project ${pro.id} added successfully.`);
                    } catch (error) {
                      console.error(`Failed to add project ${pro.id}:`, error);
                    }
                  })
                ).then(() => {
                  console.log("All projects have been processed.");
                });
              }
              removePlayerFromSecondPMList(player.id);
              addPlayer(player);
                setCount(count + 1);
              handlePlayerDrop(player);
            } else {
              console.warn(`Player with ID ${item.id} does not have the 'PLAYER' role. Drop ignored.`);
            }
          }
          break;
          case 'third':
            player = Object.values(THRDMList).find(p => p.id === item.id);
            if (player) {
              if (player.role === 'EMPLOYEE') {
                setThirdList(prev => {
                  const newList = [...prev];
                  return newList;
                });
                removePlayerFromThirdPMList(player.id);
                addPlayer(player);
                setCount(count + 1);
                if (THRDMList.projects && THRDMList.projects.length > 0) {
                  Promise.all(
                    THRDMList.projects.map(async (pro) => {
                      try {
                        await addProject(pro);
                        console.log(`Project ${pro.id} added successfully.`);
                      } catch (error) {
                        console.error(`Failed to add project ${pro.id}:`, error);
                      }
                    })
                  ).then(() => {
                    console.log("All projects have been processed.");
                  });
                }
                handlePlayerDrop(player);
              } else {
                console.warn(`Player with ID ${item.id} does not have the 'PLAYER' role. Drop ignored.`);
              }
            }
            break;
        case 'rmOne':
          if(ResourceManagerOneList.owner !== null) {
            player = ResourceManagerOneList.owner.id === item.id;
              removePlayerFromResourceManagerOne();
              addPlayer(ResourceManagerOneList.owner);
              setCount(count + 1);
          }
            break;
        case 'rmTwo':
          if(ResourceManagerTwoList.owner !== null) {
            player = ResourceManagerTwoList.owner.id === item.id;
              removePlayerFromResourceManagerTwo();
              addPlayer(ResourceManagerTwoList.owner);
              setCount(count + 1);
          }
            break;
        default:
          console.warn(`Unknown typeOfList: ${item.typeOfList}`);
          setCount(count + 1);
      }
    },
  });
  // Function to handle player drop logic based on role
  const handlePlayerDrop = (player: Player) => {
    if (player.role === 'EMPLOYEE') {
      setPlayers(prev => [...prev, player]);
    }
  };
  // Function to add associated projects to the projects list
  const addProjectsToList = (projects: Project) => {
    setProjects(prev => [...prev, ...projects]); // Add the projects to the main projects list
  };
  const [{ isOverPro }, dropPro] = useDrop({
  accept: ['PLAYER', 'PROJECT'], // Accept both PLAYER and PROJECT types
  drop: (item) => {
    let entity;
    switch (item.typeOfList) {
      case 'first':
        entity = Object.values(FPMList.projects).find(p => p.id === item.id);
        if (entity) {
          if (item.type === 'PLAYER' && entity.role !== 'PLAYER' && !projects.some(p => p.id === entity.id)) {
             setProjects(prev => [...prev, entity]); 
              addProject(entity);
            console.log(entity.id, "project to be removed")
            setFirstList(prev => prev.filter(p => p.id !== item.id));
            removeProjectFromPMList(entity.id);
          }
          if (item.type === 'PROJECT' && !projects.some(p => p.id === entity.id)) {
            addProject(entity);
             setProjects(prev => [...prev, entity]);
            setFirstList(prev => prev.filter(p => p.id !== item.id));
          }
        }
          setCount(count + 1);
        break;
      case 'second':
        entity =  Object.values(SPMList.projects).find(p => p.id === item.id);
        if (entity) {
          if (item.type === 'PLAYER' && entity.role !== 'PLAYER' && !projects.some(p => p.id === entity.id)) {
            setProjects(prev => [...prev, entity]);
            addProject(entity);
            setSecondList(prev => prev.filter(p => p.id !== item.id));
             removeProjetFromSecondPMList(entity.id);
          }
          if (item.type === 'PROJECT' && !projects.some(p => p.id === entity.id)) {
            setProjects(prev => [...prev, entity]);
            setSecondList(prev => prev.filter(p => p.id !== item.id));
            addProject(entity);
          }
        }
          setCount(count + 1);
        break;

        case 'third':
          entity = Object.values(THRDMList.projects).find(p => p.id === item.id);
          if (entity) {
            if (item.type === 'PLAYER' && entity.role !== 'PLAYER' && !projects.some(p => p.id === entity.id)) {
               setProjects(prev => [...prev, entity]); 
                addProject(entity);
              console.log(entity.id, "project to be removed")
              setThirdList(prev => prev.filter(p => p.id !== item.id));
              removeProjectFromThirdPMList(entity.id);
            }
            if (item.type === 'PROJECT' && !projects.some(p => p.id === entity.id)) {
              addProject(entity);
               setProjects(prev => [...prev, entity]);
              setThirdList(prev => prev.filter(p => p.id !== item.id));
            }
          }
            setCount(count + 1);
          break;
      case 'rmOne':
        entity = RMOneList.find(e => e.id === item.id);
        if (entity) {
          if (item.type === 'PLAYER' && entity.role !== 'PLAYER' && !projects.some(p => p.id === entity.id)) {
            setProjects(prev => [...prev, entity]);
            setRMOneList(prev => prev.filter(p => p.id !== item.id));
          }
          if (item.type === 'PROJECT' && !projects.some(p => p.id === entity.id)) {
            setProjects(prev => [...prev, entity]);
            setRMOneList(prev => prev.filter(p => p.id !== item.id));
          }
        }
          setCount(count + 1);
        break;

      case 'rmTwo':
        entity = RMTwoList.find(e => e.id === item.id);
        if (entity) {
          if (item.type === 'PLAYER' && entity.role !== 'PLAYER' && !projects.some(p => p.id === entity.id)) {
            setProjects(prev => [...prev, entity]);
            setRMTwoList(prev => prev.filter(p => p.id !== item.id));
          }
          if (item.type === 'PROJECT' && !projects.some(p => p.id === entity.id)) {
            setProjects(prev => [...prev, entity]);
            setRMTwoList(prev => prev.filter(p => p.id !== item.id));
          }
        }
          setCount(count + 1);
        break;

      default:
        console.warn(`Unknown typeOfList: ${item.typeOfList}`);
    }
  },
});

console.log(fpmlist, "fpm list");
console.log(spmlist, "spm list");
console.log(thrdpmlist, "thrd pm list");
  return (
    <div className='container'>
    <div style={{width: "100%", marginTop: '60px'}}>
      {dealer.map(each => (
        <h3 style={{color: 'white', width: "90%", textAlign: 'right', fontSize:'26px', fontFamily:'Roboto'}}>Welcome {each.name}</h3>
      ))}
    </div>
    <div className='first-container'>
      <div ref={dropP} className="players-container">
      <h3 style={{fontFamily: 'sans-serif', textDecoration: 'underline', fontSize: '20px'}} className='p-heading'>Players</h3>
       {newPlayersCopy.map((each) => (
          <PlayerItem player={each} key={each.id} typeOfList='' />
        ))}
      </div>
      <ul className='ul-container'>
        <div ref={drop} className="project">
          <h4>Project Manager 1</h4>
          <div className='pm-container'>
            {fpmlist.owner && (
              <div>
                {fpmlist.owner && (
                  <PlayerItems player={fpmlist.owner} key={fpmlist.owner.id} typeOfList="first" />
                )}
              </div>
            )}
            {FPMList.projects.length > 0 && (
              <div>
                {FPMList.projects.map(each => (
                  
                  <PlayerItems player={each} typeOfList='first' />
                ))}
              </div>
            )}
          </div>
        </div> 
         <div ref={dropPM2} className="project">
          <h4>Project Manager 2</h4>
          <div className='pm-container'>
          {spmlist.owner && (
              <div>
                {spmlist.owner && (
                  <PlayerItems player={spmlist.owner} key={spmlist.owner.id} typeOfList="second" />
                )}
              </div>
            )}
            {SPMList.projects.length > 0 && (
              <div>
                {SPMList.projects.map(each => (
                  
                  <PlayerItems player={each} typeOfList='second' />
                ))}
              </div>
            )}
          </div>
        </div> 
         <div ref={dropPM3} className="project">
          <h4>Project Manager 3</h4>
          <div className='pm-container'>
          {thrdpmlist.owner && (
              <div>
                {thrdpmlist.owner && (
                   <div>
                     <hr/>
                      <PlayerItems player={thrdpmlist.owner} key={thrdpmlist.owner.id} typeOfList="third" />
                     <hr />
                   </div>
                 )}
               </div>
             )}
             {THRDMList.projects.length > 0 && (
               <div>
                 {THRDMList.projects.map(each => (
                  
                   <PlayerItems player={each} typeOfList='third' />
                 ))}
               </div>
             )}
           </div>
        </div>
         <div ref={dropRM1} className="project">
           <h4>Resource Manager 1</h4>
          {ResourceManagerOneList.owner && (
             <PlayerItems player={ResourceManagerOneList.owner} key={ResourceManagerOneList.owner.id} typeOfList="rmOne" />
          )}
        </div>
        <div ref={dropRM2} className="project">
          <h4>Resouce Manager 2</h4>
          {ResourceManagerTwoList.owner && (
            <PlayerItems player={ResourceManagerTwoList.owner} key={ResourceManagerTwoList.owner.id} typeOfList="rmTwo" />
          )}
        </div>
      </ul>
      <div ref={dropPro} className="projects-container">
      <h3 style={{fontFamily: 'sans-serif', textDecoration: 'underline', fontSize: '20px'}} className='p-heading'>Projects</h3>
        {projects.map((each) => (
          <ProjectItem project={each} key={each.id} />
        ))}
      </div>
    </div>
    <div className='btns-container'>
    <Popup open={showPopup} onClose={() => setShowPopup(false)} className='popup' >
        <div>
          <p>Starting the game is not allowed without all roles being assigned!</p>
          <button onClick={() => setShowPopup(false)} className='close-btn'>Close</button>
        </div>
      </Popup>
      {(isStartGameButtonClicked) ? (
        <button type='button' className='btns'  onClick={() => navigate(`/game/score/${gameId}`)}>End Game</button>
          ) : (
        <>
          <button type='button' className='btns' onClick={handleStartGame}>Start Game</button>
          <button type='button' className='btns' onClick={resetGame}>Reset</button>
        </>
        )}
    </div>
    </div>
  );
};

export default DealerPage;


