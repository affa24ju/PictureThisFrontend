import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client"


//test
const userName = "yourUserName"; // Replace with actual username or import from relevant module

export const StompClient = new Client({
    // Användarnamn för att autentisera användaren
    connectHeaders: {"user": userName},
    //Loggar all data till konsolen
    debug: (str) => console.log(str),
    //om anslutningen bryts så försöker den återansluta var 5 sekund.
    reconnectDelay: 5000,
    //hur den skapar transporten och skapar en StockJS instans mot backend
    webSocketFactory: () => {
        return new SockJS(`http://localhost:8080/ws`);
    }
})