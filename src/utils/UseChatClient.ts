import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";

interface ChatMessage {
    content : string;
    user: {
        id: string;
        userName: string;
    }
}

export function useChatClient() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(()=>{
        StompClient.onConnect = () =>{
            console.log("Connected to stomp");

            StompClient.subscribe('/topic/messages', (greetings)=>{
                console.log("New message received" + greetings.body);
                const pars = JSON.parse(greetings.body);
                console.log("received message: ", pars);
                setMessages((p) => [...p, pars]);
            });
            console.log()
        }
        StompClient.activate();
    }, [])

    const sendMessage = (greetings:string)=>{
        StompClient.publish({
            destination: '/app/chat',
            body: JSON.stringify({
                content: greetings,
                user: {
                    id: "user_id",
                    userName: "user_name"
                }
            })
        });
    }

    return {messages, sendMessage}
}