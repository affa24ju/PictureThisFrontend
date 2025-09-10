 import { useEffect, useState, useCallback } from "react";
 import { StompClient } from "./StompConnect";


interface Line{
    // även fast vi har double i backen så ska number fungera i ts
    points: number[];
    color:string;
    tool:string;
    newLine: boolean;
}


 export function useGameClient(){
    
    const [connected, setConnected] = useState(false);
    const [lines, setLines] = useState<Line[]>([]);


 useEffect(()=>{
    let subscription: any;
    let mounted = true;

    const subscribe = () => {
        if (!mounted) return;
        
        console.log("Connected to LineStomp");
        setConnected(true);

        // vad den ska prenumerera på
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
    };

    if (StompClient.connected) {
        subscribe();
    } else if (!StompClient.active) {
        StompClient.onConnect = () => {
            if (mounted) {
                subscribe();
            }
        };
        StompClient.activate();
    } else {
        // Use polling to check for connection
        const checkConnection = () => {
            if (!mounted) return;
            if (StompClient.connected) {
                subscribe();
            } else {
                setTimeout(checkConnection, 100);
            }
        };
        checkConnection();
    }

    return () =>{
        mounted = false;
        if(subscription) subscription.unsubscribe();
    }
    
 },[])

    const sendLine = useCallback((data: Line) => {
        console.log("sendLine anropad med:", data);
        StompClient.publish({
            destination:"/app/draw",
            body: JSON.stringify(data),

        });
    }, []);

    //rensar linjerna
    const clearLines = useCallback(() => {
        setLines([]);
    }, []);

    return{connected, lines, sendLine, clearLines}
 }