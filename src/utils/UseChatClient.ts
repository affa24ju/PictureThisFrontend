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

    // Add game messages to chat messages
    useEffect(() => {
        if (gameMessages.length > lastGameMessageCount) {
            // Add only the new messages
            const newMessages = gameMessages.slice(lastGameMessageCount);
            setMessages(prev => [...prev, ...newMessages]);
            setLastGameMessageCount(gameMessages.length);
        }
    }, [gameMessages, lastGameMessageCount]);

    // useEffect för att subscriba till /topic/messages
    useEffect(() => {
        let subscriptions: any[] = [];
        let mounted = true;

        const subscribe = () => {
            if (!mounted) return;
            
            const sub1 = StompClient.subscribe("/topic/messages", (msg) => {
                const chat = JSON.parse(msg.body);
                setMessages((prev) => [...prev, chat]);
            });
            
            subscriptions = [sub1];
        };

        if (StompClient.connected) {
            subscribe();
            setConnected(true);
        } else {
            // Use a timeout to check connection status after other hooks have set up
            const checkConnection = () => {
                if (!mounted) return;
                if (StompClient.connected) {
                    subscribe();
                    setConnected(true);
                } else {
                    setTimeout(checkConnection, 100);
                }
            };
            checkConnection();
        }

        return () => {
            mounted = false;
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