import { Client, IMessage } from '@stomp/stompjs';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import { IoClose, IoSend } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';

import { ChatMessage, Player } from '../../types/types';
import './index.css';

const ChatWindow = () => {
  const [client, setClient] = useState<Client>();
  const [isChatOpen, setChatOpen] = useState<boolean>(false);
  const [sendMsg, setSendMsg] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);
  // const [playerId, setPlayerId] = useState<string | null>('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = location.pathname.split('/')[3];
  // const playerId = ;
  const chatContainerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to the WebSocket.');
        stompClient.subscribe(`/topics/messages/${gameId}`, handleSubscribeMsg);
        stompClient.subscribe(`/topics/chat-history/${gameId}`, handleSubscribeMsgList);
        stompClient.publish({
          destination: `/game/chat/history/${gameId}`,
        });
      },

      onStompError: (frame) => {
        console.error('Broker Error: ' + frame.headers['message']);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket connection lost.');
        console.log('Close event details:', event);
        if (event) {
          console.log('Code:', event.code);
          console.log('Reason:', event.reason);
          console.log('Was Clean:', event.wasClean);
        }
      },
    });

    stompClient.activate();
    setClient(stompClient);
    const playerId = searchParams.get('playerId');
    const ownerId = searchParams.get('ownerId');
    const finalPlayerId = playerId !== undefined ? playerId : ownerId;
    // setPlayerId(finalPlayerId);
    getPlayer(finalPlayerId);
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [location]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  const getPlayer = async (id: string | null) => {
    try {
      const response = await fetch(`http://localhost:8080/game/${gameId}/players/${id}`);
      const data = await response.json();
      setCurrentPlayer(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscribeMsg = (message: IMessage) => {
    const chatMsg = JSON.parse(message.body);
    console.log(chatMsg);

    setMessageList((prevMessages) => [...prevMessages, chatMsg]);
    setUnreadMsgCount((prev) => prev + 1);
  };

  const handleSubscribeMsgList = (message: IMessage) => {
    const chatMessages = JSON.parse(message.body);
    setMessageList(chatMessages);
    // console.log(chatMessages);
  };

  const triggerChatWindow = () => {
    setChatOpen((prev) => !prev);
    setUnreadMsgCount(0);
  };

  const handleSendMsg = (e: ChangeEvent<HTMLInputElement>) => {
    setSendMsg(e.target.value);
  };

  const onClickSendMsg = () => {
    const chatMsg = {
      sender: currentPlayer?.name,
      message: sendMsg,
      dateTime: new Date().toISOString(),
    };
    if (client && client.connected) {
      client.publish({
        destination: `/game/chat/${gameId}`,
        body: JSON.stringify(chatMsg),
      });
    }
    // console.log(sendMsg);
    setSendMsg('');
  };

  const convertDateToTime = (isoDateString: string) => {
    const date = new Date(isoDateString);

    const modifiedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
    return modifiedTime;
  };

  return (
    <div className="chat-window-main-container">
      {!isChatOpen && (
        <button className="chat-btn" onClick={triggerChatWindow}>
          <IoIosChatboxes />
          {unreadMsgCount > 0 && <sup className="new-msg-count">{unreadMsgCount}</sup>}
        </button>
      )}
      {isChatOpen && (
        <div className="chat-room-container">
          <button className="chat-close-btn" onClick={triggerChatWindow}>
            <IoClose />
          </button>
          <ul className="chat-messages-list-container" ref={chatContainerRef}>
            {messageList.map((eachMsg) => (
              <li className={`user-msg-container ${eachMsg.sender === currentPlayer?.name && 'sender-msg'}`} key={eachMsg.dateTime}>
                {eachMsg.sender !== currentPlayer?.name && <span className="msg-user-name">{eachMsg.sender}</span>}
                <p className="user-msg">{eachMsg.message}</p>
                <span className="chat-time">{convertDateToTime(eachMsg.dateTime)}</span>
              </li>
            ))}
          </ul>
          <div className="chat-text-box-container">
            <input type="text" placeholder="Chat with your team..." className="chat-text" value={sendMsg} onChange={handleSendMsg} />
            <button type="button" className="chat-msg-send-btn" disabled={!sendMsg && true} onClick={onClickSendMsg}>
              <IoSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
