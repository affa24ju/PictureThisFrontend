import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";


export function useChatClient() {
    const[message, setMessage] = useState<string | null>(null);

    useEffect(()=>{
        StompClient.onConnect = () =>{
            console.log("Connected to stomp");
        }
        StompClient.activate();
    }, [])
}