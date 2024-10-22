import './index.css'
import SockJS from 'sockjs-client';
import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const Player = () => {
    const [projects, setProjects] = useState([]);
    const [players, setPlayers] = useState([]);
    const [SPMList, setSPMList] = useState({
        id: null,
        owner: null,
        projects: [], 
    });
    const [firstList, setFirstList] = useState({
        id: null,
        owner: null,
        projects: [], 
    });
    const [ThirdPMList, setThirdPMList] = useState({
        id: null,
        owner: null,
        projects: [],
    })
    const [RmOneList, setResourceManagerOne] = useState([]);
    const [RmTwoList, setResourceManagerTwo] = useState([]);
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/DealerPage");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe("/topic/modified", (message) => {
                    const gameData = JSON.parse(message.body);
                      setProjects(gameData);
                      console.log(gameData, "Projects List");
                });
                stompClient.publish({
                    destination: "/app/modified"
                });
                stompClient.subscribe("/topic/modifiedPlayers", (message) => {
                  const playersCopyy = JSON.parse(message.body);
                  console.log(playersCopyy, "players copy");
                  // setNewPlayersCopy(playersCopyy.slice(1,playersCopyy.length));
                })
                stompClient.publish({
                  destination: "/app/players/modified"
                })
                stompClient.subscribe("/topic/players", (message) => {
                    const gameData = JSON.parse(message.body);
                      setPlayers(gameData);             
                });
                stompClient.publish({
                    destination: "/app/players"
                });
                stompClient.subscribe("/topic/firstPMList", (message) => {
                    const updatedList = JSON.parse(message.body);
                    console.log("Updated first PM list received:", updatedList);
                    setFirstList(updatedList);
                  });
                  stompClient.publish({
                    destination: "/app/getFirstPMList"
                  });
                // get second PM List
                  stompClient.subscribe("/topic/secondPMList", (message) => {
                  const updatedList = JSON.parse(message.body);
                  console.log("Updated first PM list received:", updatedList);
                  setSPMList(updatedList);
                  });
                  stompClient.publish({
                    destination: "/app/getSecondPMList"
                  });
                   // get third pm list
        stompClient.subscribe("/topic/thirdPMList", (message) => {
            const thirdListt = JSON.parse(message.body);
            setThirdPMList(thirdListt);
          })
          stompClient.publish({
            destination: "/app/getThirdPMList"
          })
          // get Resource Manager One List
       stompClient.subscribe("/topic/getResourceManagerOne", (message) => {
        const rmoneList = JSON.parse(message.body);
        setResourceManagerOne(rmoneList);
       })
       stompClient.publish({
        destination: "/app/getResourceManagerOne"
       })
       // get Resource Manager Two List
       stompClient.subscribe("/topic/getResourceManagerTwo", (message) => {
        const rmTwoList = JSON.parse(message.body);
        setResourceManagerTwo(rmTwoList);
       })
       stompClient.publish({
        destination: "/app/getResourceManagerTwo"
       })
              },
            onStompError: (frame) => {
                console.error("Broker Error: " + frame.headers["message"]);
            },
        });
    
        stompClient.activate();
        return () => {
            stompClient.deactivate();
        };
    }, []);
   console.log(firstList)
   console.log(RmOneList, "rm one list");
   console.log(RmTwoList, "rm two list");
  return (
    <div>
      <div className='main-containerr'>
        <div className='players-container'><h4 style={{fontFamily: 'sans-serif', color: 'white', textDecoration: 'underline', fontSize: '20px'}} className='p-heading' >Players</h4>
        {players.map(each => (
            <h4 className='each-player' style={{color: 'white'}} key={each.id}>{each.name}</h4>
        ))}</div>
        <div className="ul-container">
            <div className="project"><h4>ProjectManager 1</h4>
            {firstList.owner && (
                <div>
                  <h4 className='each-player'>{firstList.owner.name}</h4>
                </div>
            )}
             <div>
            {firstList.projects.length > 0 && (
                <div>
                    {firstList.projects.map(each => (
                        <h4 key={each.id} className='each-player'>{each.name}</h4>
                    ))}
                </div>
            )}
          </div>
            </div>
            <div className="project">
                <h4>ProjectManager 2</h4>
                {SPMList.owner && (
                <div>
                  <h4 className='each-player'>{SPMList.owner.name}</h4>
                </div>
            )}
             <div>
            {SPMList.projects.length > 0 && (
                <div>
                    {SPMList.projects.map(each => (
                        <h4 key={each.id} className='each-player'>{each.name}</h4>
                    ))}
                </div>
            )}
          </div>
            </div>
            <div className="project">
                <h4>ProjectManager 3</h4>
                {ThirdPMList.owner && (
                <div>
                  <h4 className='each-player'>{ThirdPMList.owner.name}</h4>
                </div>
            )}
             <div>
            {ThirdPMList.projects.length > 0 && (
                <div>
                    {ThirdPMList.projects.map(each => (
                        <h4 key={each.id} className='each-player'>{each.name}</h4>
                    ))}
                </div>
            )}
          </div>
            </div>
            <div className="project">
              <h4>ResourceManager 1</h4>
              {RmOneList.owner && (
                <div>
                  <h4 className='each-player'>{RmOneList.owner.name}</h4>
                </div>
              )}
            </div>
            <div className="project">
              <h4>ResourceManager 2</h4>
              {RmTwoList.owner && (
                <div>
                  <h4 className='each-player'>{RmTwoList.owner.name}</h4>
                </div>
            )}
            </div>
        </div>
        <div className="projects-container">
            <h4 style={{fontFamily: 'sans-serif', color: 'white',textDecoration: 'underline', fontSize: '20px'}}  className='p-heading'>Projects</h4>
            {projects.map(each => (
                <h5 style={{color: 'white'}} className='each-project' key={each.id}>{each.name}</h5>
            ))}
        </div>
      </div>
    </div>
  )
}
export default Player
