import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";

interface ChatMessage {
    messageContent: string;
    userName: string;
    
}

export function useChatClient() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const [connected, setConnected] = useState(false);

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
      subscriptions = [sub1, sub2];
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

/*
    useEffect(()=>{
        StompClient.onConnect = () =>{
            console.log("Connected to stomp");

            StompClient.subscribe('/topic/messages', (greetings)=>{
                console.log("Sub callback fired!", greetings);
                console.log("New message received" + greetings.body);
                const pars = JSON.parse(greetings.body);
                console.log("received message: ", pars);
                setMessages((p) => [...p, pars]);
            });
            console.log()
        }
        StompClient.activate();

        return () =>{
            StompClient.deactivate();
        }
    }, [])

    const sendMessage = (greetings:string)=>{
        StompClient.publish({
            destination: '/app/chat',
              body: JSON.stringify({
              userName: currentUser.userName,
              messageContent: greetings
            })
        });
    }

    return {messages, sendMessage}
}
*/

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