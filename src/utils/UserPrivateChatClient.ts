import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";

interface ChatMessage {
    messageContent: string;
    userName: string;
    
}

// hook för att få privata meddelanden till användaren denna ger nästa ritares ord utan att dom andra ser ordet.
export function UserPrivateChatClient() {
        const [messages, setMessages] = useState<ChatMessage[]>([]);
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const [connected, setConnected] = useState(false);
    
        // useEffect för att subscriba till /user/queue/game-state
        useEffect(() => {
      let subscription: any;
    
      const subscribe = () => {
        if (!subscription) {
          subscription = StompClient.subscribe('/user/queue/game-state', (word) => {
            const chat = JSON.parse(word.body);
            setMessages((prev) => [...prev, chat]);
          });
        }
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
        if (subscription) subscription.unsubscribe();
      };
    }, []);

    // funktion för att skicka meddelande till backend
    
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