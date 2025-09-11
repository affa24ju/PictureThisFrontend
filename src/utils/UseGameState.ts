import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";

type GameUpdate =
  | { event: "CORRECT_GUESS"; content: { userName: string; word: string } }
  | { event: "NEW_ROUND"; content: { userName: string } }
  | { event: "PLAYER_JOINED"; content: { userName: string } }
  | { event: "PLAYER_LEFT"; content: { userName: string } };

interface GameMessage {
  messageContent: string;
  userName: string;
}

interface GameState {
  currentWord: string | null;
  isDrawer: boolean;
  gameUpdate: GameUpdate | null;
  gameMessages: GameMessage[];
}

export function useGameState() {
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [isDrawer, setIsDrawer] = useState(false);
  const [gameUpdate, setGameUpdate] = useState<GameUpdate | null>(null);
  const [gameMessages, setGameMessages] = useState<GameMessage[]>([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    if (!gameUpdate) return;
    
    let messageContent = "";
    switch (gameUpdate.event) {
      case "CORRECT_GUESS":
        messageContent = `Grattis! ${gameUpdate.content.userName} du Gissade rätt! ordet var ${gameUpdate.content.word} 🎉`;
        break;
      case "NEW_ROUND":
        messageContent = `Ny runda! ${gameUpdate.content.userName} är nästa att rita. 🖌️`;
        setIsDrawer(gameUpdate.content.userName === currentUser.userName);
        if (gameUpdate.content.userName !== currentUser.userName) {
          setCurrentWord(null);
        }
        break;
      case "PLAYER_JOINED":
        messageContent = `Välkommen ${gameUpdate.content.userName}! 🎉`;
        break;
      case "PLAYER_LEFT":
        messageContent = `${gameUpdate.content.userName} har lämnat spelet. 😢`;
        break;
    }

    if (messageContent) {
      const gameMessage: GameMessage = {
        messageContent,
        userName: "System",
      };
      setGameMessages(prev => [...prev, gameMessage]);
    }
  }, [gameUpdate, currentUser.userName]);

  // useEffect för att subscriba till /topic/game-updates och game-state
  useEffect(() => {
    let subscriptions: any[] = [];
    const preOnConnect = StompClient.onConnect;

    const subscribe = () => {
      const sub1 = StompClient.subscribe("/user/queue/game-state", (word) => {
        const wordToDraw = word.body;
        console.log("Ordet att rita är: " + wordToDraw);
        setCurrentWord(wordToDraw);
        setIsDrawer(true);
        
        // Add word as a game message
        const gameMessage: GameMessage = {
          messageContent: `Ditt ord att rita är: ${wordToDraw} 🎨`,
          userName: "System",
        };
        setGameMessages(prev => [...prev, gameMessage]);
      });

      const sub2 = StompClient.subscribe("/topic/game-updates", (update) => {
        const gameUpdate = JSON.parse(update.body);
        setGameUpdate(gameUpdate);
      });

      subscriptions = [sub1, sub2];
      console.log("Connected to GameStateStomp");
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

  const gameState: GameState = {
    currentWord,
    isDrawer,
    gameUpdate,
    gameMessages,
  };

  return gameState;
}
