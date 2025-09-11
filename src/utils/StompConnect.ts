import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client"
import { SERVER_BASE_URL } from "../config/server";


//test
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}"); // Replace with actual username or import from relevant module

export const StompClient = new Client({
    //Loggar all data till konsolen
    debug: (str) => console.log(str),
    //om anslutningen bryts så försöker den återansluta var 5 sekund.
    reconnectDelay: 5000,
    //hur den skapar transporten och skapar en StockJS instans mot backend
    webSocketFactory: () => {
        return new SockJS(`${SERVER_BASE_URL}/ws?user=${currentUser.userName}`);
    }
})

