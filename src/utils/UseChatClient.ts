import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";

interface ChatMessage {
    messageContent: string;
    userName: string;  
}

export function useChatClient(gameMessages: Array<{messageContent: string; userName: string}>) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const [connected, setConnected] = useState(false);
    
    const [lastGameMessageCount, setLastGameMessageCount] = useState(0);

    useEffect(() => {
        if (gameMessages.length > lastGameMessageCount) {
            const newMessages = gameMessages.slice(lastGameMessageCount);
            setMessages(prev => [...prev, ...newMessages]);
            setLastGameMessageCount(gameMessages.length);
        }
    }, [gameMessages, lastGameMessageCount]);

    // useEffect för att subscriba till /topic/messages
    useEffect(() => {
        let subscriptions: any[] = [];
        const preOnConnect = StompClient.onConnect;

        const subscribe = () => {
            const sub1 = StompClient.subscribe("/topic/messages", (msg) => {
                const chat = JSON.parse(msg.body);
                setMessages((prev) => [...prev, chat]);
            });
            
            subscriptions = [sub1];
            setConnected(true);
            console.log("Connected to Chatstomp");
        };

        StompClient.onConnect = (frame) => {
            if (preOnConnect) preOnConnect(frame);
            subscribe();
        };

        if (StompClient.connected) {
            subscribe();
        } else if (!StompClient.active) {
            StompClient.activate();
        }

        return () => {
            subscriptions.forEach((sub) => sub && sub.unsubscribe());
            StompClient.onConnect = preOnConnect;
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