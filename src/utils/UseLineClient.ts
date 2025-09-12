import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";


interface Line {
    // även fast vi har double i backen så ska number fungera i ts
    points: number[];
    color: string;
    tool: string;
    newLine: boolean;
}


export function useGameClient() {

    const [connected, setConnected] = useState(false);
    const [lines, setLines] = useState<Line[]>([]);

// useEffect för att subscriba till /topic/line
    useEffect(() => {
        const preOnConnect = StompClient.onConnect;
        let subscription: any;

        StompClient.onConnect = (frame) => {
            if (preOnConnect) preOnConnect(frame)

            console.log("Connected to LineStomp");
            setConnected(true);

            // Den subscribear 2 gånger, så subscribea endast om ej subscribead (:
            if (!subscription) {
                subscription = StompClient.subscribe("/topic/line", (drawer) => {
                    const stroke = JSON.parse(drawer.body);
                    console.log("Mottagit linje från backend:", stroke);

                    setLines((prev) => {
                        if (stroke.newLine) {
                            return [...prev, { tool: stroke.tool, points: stroke.points, color: stroke.color, newLine: stroke.newLine }];
                        } else {
                            const updated = [...prev];
                            if (updated.length > 0) {
                                updated[updated.length - 1] = {
                                    tool: stroke.tool,
                                    points: stroke.points,
                                    color: stroke.color,
                                    newLine: stroke.newLine
                                };
                            }
                            return updated;
                        }
                    });
                });
            }
        }

        if (!StompClient.active) {
            StompClient.activate();
        }

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                subscription = null;
            }
            StompClient.onConnect = preOnConnect;
        }

    }, [])

    // funktion för att skicka linjer till backend

    const sendLine = (data: Line) => {
        console.log("sendLine anropad med:", data);
        StompClient.publish({
            destination: "/app/draw",
            body: JSON.stringify(data),

        });
    };

    return { connected, lines, sendLine, setLines }
}