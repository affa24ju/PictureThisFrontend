// import { useEffect, useState } from "react";
// import { StompClient } from "./StompConnect";
// import React from "react";
// import { Stage, Layer, Line, Text } from 'react-konva';


// export function useClient(){
// const [connected, setConnected] = useState(false);
//     const [isDrawer, setIsDrawer] = useState(false);
//     const [lines, setLines] = React.useState([]);


// useEffect(()=>{
//     StompClient.onConnect =() =>{
//         console.log("Connected to stomp");
//         setConnected(true);
//         if(!isDrawer){
//             StompClient.subscribe("/topic", (message)=>{
//                 const stroke =JSON.parse(message.body);
//                 console.log(stroke);
//                 setLines((prev) => {
//             if (stroke.newLine) {
//             return [...prev, { tool: stroke.tool, points: stroke.points }];
//             } else {
//             const updated = [...prev];
//             if (updated.length > 0) {
//                 updated[updated.length - 1] = { tool: stroke.tool, points: stroke.points };
//             }
//             return updated;
//             }
                    
//                 })
//             });
//         }
//     }
//     StompClient.activate();
    
// },[])
// }