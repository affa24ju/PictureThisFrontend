import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";
import { useGameState } from "./UseGameState";

interface ChatMessage {
    messageContent: string;
    userName: string;  
}

export function useChatClient() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const [connected, setConnected] = useState(false);
    const { gameMessages } = useGameState();

    // Add game messages to chat messages
    useEffect(() => {
        if (gameMessages.length > 0) {
            const latestGameMessage = gameMessages[gameMessages.length - 1];
            setMessages(prev => [...prev, latestGameMessage]);
        }
    }, [gameMessages]);

    // useEffect för att subscriba till /topic/messages
    useEffect(() => {
        let subscriptions: any[] = [];

        const subscribe = () => {
            const sub1 = StompClient.subscribe("/topic/messages", (msg) => {
                const chat = JSON.parse(msg.body);
                setMessages((prev) => [...prev, chat]);
            });
            
            subscriptions = [sub1];
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