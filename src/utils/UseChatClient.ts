import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";

interface ChatMessage {
    messageContent: string;
    userName: string;
    
}

export function useChatClient() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{")

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