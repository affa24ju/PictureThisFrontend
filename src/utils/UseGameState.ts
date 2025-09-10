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

  // Handle game events and generate messages
  useEffect(() => {
    if (!gameUpdate) return;
    
    let messageContent = "";
    switch (gameUpdate.event) {
      case "CORRECT_GUESS":
        messageContent = `Grattis! ${gameUpdate.content.userName} du Gissade rätt! ordet var ${gameUpdate.content.word} 🎉`;
        break;
      case "NEW_ROUND":
        messageContent = `Ny runda! ${gameUpdate.content.userName} är nästa att rita. 🖌️`;
        // Update drawer status for new round
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
        userName: "System", // System messages
      };
      setGameMessages(prev => [...prev, gameMessage]);
    }
  }, [gameUpdate, currentUser.userName]);

  // Subscribe to game-related STOMP topics
  useEffect(() => {
    let subscriptions: any[] = [];

    const subscribe = () => {
      // Subscribe to personal word assignments
      const wordSub = StompClient.subscribe("/user/queue/game-state", (word) => {
        const wordToDraw = word.body;
        console.log("Ordet att rita är: " + wordToDraw);
        setCurrentWord(wordToDraw);
        setIsDrawer(true);
      });

      // Subscribe to game updates
      const gameUpdateSub = StompClient.subscribe("/topic/game-updates", (update) => {
        const gameUpdate = JSON.parse(update.body);
        setGameUpdate(gameUpdate);
      });

      subscriptions = [wordSub, gameUpdateSub];
    };

    if (StompClient.connected) {
      subscribe();
    } else if (!StompClient.active) {
      StompClient.onConnect = () => {
        subscribe();
        console.log("Connected to Game State");
      };
      StompClient.activate();
    }

    return () => {
      subscriptions.forEach((sub) => sub && sub.unsubscribe());
    };
  }, [currentUser.userName]);

  const gameState: GameState = {
    currentWord,
    isDrawer,
    gameUpdate,
    gameMessages,
  };

  return gameState;
}
