import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";

interface ChatMessage {
    messageContent: string;
    userName: string;  
}


type gameUpdate=
  |  {event: "CORRECT_GUESS"; content: {userName: string; word: string} }
  |  {event: "NEW_ROUND"; content: {userName: string } }
  |  {event: "PLAYER_JOINED"; content: {userName: string}}
  |  {event: "PLAYER_LEFT"; content: {userName: string}}

export function useChatClient() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const [connected, setConnected] = useState(false);
    const [gameUpdate, setGameUpdate] = useState<gameUpdate | null>(null);
    // useEffect för gamePlay
      useEffect(()=>{
        if(!gameUpdate) return;
       switch(gameUpdate.event) {
        case "CORRECT_GUESS":
          sendMessage(`Grattis! ${gameUpdate.content.userName} du Gissade rätt! ordet var ${gameUpdate.content.word} 🎉`);
          break;
        case "NEW_ROUND":
          sendMessage(`Ny runda! ${gameUpdate.content.userName} är nästa att rita. 🖌️`);
          break;
        case "PLAYER_JOINED":
          sendMessage(`Välkommen ${gameUpdate.content.userName}! 🎉`)
          break
          case "PLAYER_LEFT":
            sendMessage(`${gameUpdate.content.userName} har lämnat spelet. 😢`);
          break;
       } 
    },[gameUpdate])

    // useEffect för att subscriba till /topic/messages
  useEffect(() => {
    let subscriptions: any[] = [];

    const subscribe = () => {
      const sub1 = StompClient.subscribe("/topic/messages", (msg) => {
        const chat = JSON.parse(msg.body);
        setMessages((prev) => [...prev, chat]);
      });
      
      const sub2 = StompClient.subscribe("/user/queue/game-state", (word) => {
        const wordToDraw = word.body;
        console.log("Ordet att rita är: " + wordToDraw);
      });

       const sub3 = StompClient.subscribe("/topic/game-updates", (update)=>{
      const gameUpdate = JSON.parse(update.body);
      setGameUpdate(gameUpdate);
    });
      subscriptions = [sub1, sub2, sub3];
    };

   

    if (StompClient.connected) {
      subscribe();
    } else if (!StompClient.active) {
      StompClient.onConnect = () => {
        subscribe();
        setConnected(true);
        console.log("Connected to Chatstomp");
      };
      StompClient.activate();
    }

    return () => {
      subscriptions.forEach((sub) => sub && sub.unsubscribe());
    };
  }, []);

  // funktion för att skicka meddelande
    const sendMessage = (greetings: string) => {
         if (!connected) {
    console.warn("Chat not connected yet");
    return;
  }
        StompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify({
                userName: currentUser.userName,
                messageContent: greetings,
            }),
        });
    };

    return { messages, sendMessage };
}