import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";


interface Line {
    // även fast vi har double i backen så ska number fungera i ts
    points: number[];
    color: string;
    tool: string;
    newLine: boolean;
    strokeWidth: number;
    
}


export function useGameClient(isDrawer: boolean = false) {

    const [connected, setConnected] = useState(false);
    const [lines, setLines] = useState<Line[]>([]);

// useEffect för att subscriba till /topic/line
    useEffect(() => {
        const preOnConnect = StompClient.onConnect;
        let subscription: any;

        const setupSubscription = () => {
            // Ta bort subscription om du är subscribead och är den som ska rita
            if (isDrawer && subscription) {
                console.log("Unsubscribing from /topic/line - switching to drawer mode");
                subscription.unsubscribe();
                subscription = null;
            }

            // Subscribea endast om du INTE är drawer och inte redan är subscribead
            if (!isDrawer && !subscription) {
                console.log("Subscribing to /topic/line as viewer");
                subscription = StompClient.subscribe("/topic/line", (drawer) => {
                    const stroke = JSON.parse(drawer.body);
                    console.log("Mottagit linje från backend:", stroke);

                    setLines((prev) => {
                        if (stroke.newLine) {
                            return [...prev, { tool: stroke.tool, points: stroke.points, color: stroke.color, newLine: stroke.newLine, strokeWidth: stroke.strokeWidth }];
                        } else {
                            const updated = [...prev];
                            if (updated.length > 0) {
                                updated[updated.length - 1] = {
                                    tool: stroke.tool,
                                    points: stroke.points,
                                    color: stroke.color,
                                    newLine: stroke.newLine,
                                    strokeWidth: stroke.strokeWidth

                                };
                            }
                            return updated;
                        }
                    });
                });
            } else if (isDrawer) {
                console.log("Not subscribing to /topic/line - I am the drawer");
            } else {
                console.log("Already subscribed to /topic/line as viewer");
            }
        };

        StompClient.onConnect = (frame) => {
            if (preOnConnect) preOnConnect(frame)

            console.log("Connected to LineStomp");
            setConnected(true);
            
            setupSubscription();
        }

        // om connected, subscribea
        if (StompClient.connected) {
            setConnected(true);
            setupSubscription();
        } else if (!StompClient.active) {
            StompClient.activate();
        }

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                subscription = null;
            }
            StompClient.onConnect = preOnConnect;
        }

    }, [isDrawer])

    // funktion för att skicka linjer till backend

    const sendLine = (data: Line) => {
        if (!connected) {
            console.warn("Försöker skicka linje men ej ansluten till server");
            return;
        }
        console.log("sendLine anropad med:", data);
        
        // Om du ritar, lägg till linjen direkt istället för att hämta från websocket
        if (isDrawer) {
            setLines((prev) => {
                if (data.newLine) {
                    return [...prev, data];
                } else {
                    const updated = [...prev];
                    if (updated.length > 0) {
                        updated[updated.length - 1] = data;
                    }
                    return updated;
                }
            });
        }
        
        StompClient.publish({
            destination: "/app/draw",
            body: JSON.stringify(data),
        });
    };

    return { connected, lines, sendLine, setLines }
}