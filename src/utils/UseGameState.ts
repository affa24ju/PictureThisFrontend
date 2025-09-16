import { useEffect, useState } from "react";
import { StompClient } from "./StompConnect";
import { getUserNameFromToken } from "./UserNameToken";

type GameUpdate =
  | { event: "CORRECT_GUESS"; content: { userName: string; word: string } }
  | { event: "NEW_ROUND"; content: { userName: string } }
  | { event: "WORD_SELECTED"; content: { userName: string } }
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
  wordOptions: string[] | null;
}

export function useGameState() {
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [isDrawer, setIsDrawer] = useState(false);
  const [gameUpdate, setGameUpdate] = useState<GameUpdate | null>(null);
  const [gameMessages, setGameMessages] = useState<GameMessage[]>([]);
  const [wordOptions, setWordOptions] = useState<string[] | null>(null);
  const userName = getUserNameFromToken();


  // useEffect för att hantera gameUpdate ändringar
  useEffect(() => {
    if (!gameUpdate) return;
    
    let messageContent = "";
    switch (gameUpdate.event) {
      case "CORRECT_GUESS":
        messageContent = `Grattis! ${gameUpdate.content.userName} du Gissade rätt! ordet var ${gameUpdate.content.word} 🎉`;
        break;
      case "NEW_ROUND":
        messageContent = `Ny runda! ${gameUpdate.content.userName} väljer ett ord att rita. 🖌️`;
        setIsDrawer(gameUpdate.content.userName === userName);
        if (gameUpdate.content.userName !== userName) {
          setCurrentWord(null);
        }
        break;
      case "WORD_SELECTED":
        messageContent = `${gameUpdate.content.userName} har valt ett ord!`;
        setWordOptions(null);
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
  }, [gameUpdate,userName]);

  // useEffect för att subscriba till /topic/game-updates och game-state
  useEffect(() => {
    let subscriptions: any[] = [];
    const preOnConnect = StompClient.onConnect;

    const subscribe = () => {
      const sub1 = StompClient.subscribe("/user/queue/game-state", (message) => {
        const wordList = JSON.parse(message.body);
        console.log("Ord att välja mellan: " + wordList);
        setWordOptions(wordList);
        setIsDrawer(true);
        
        // Skicka ett systemmeddelande när användaren blir ritare
        const gameMessage: GameMessage = {
          messageContent: `Välj ett ord att rita från alternativen 🎨`,
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

  // skicka det valda ordet till backend
  const selectWord = (selectedWord: string) => {
    if (StompClient.connected) {
      StompClient.publish({
        destination: "/app/select-word",
        body: selectedWord
      });
      setCurrentWord(selectedWord);
    }
  };

  const gameState: GameState = {
    currentWord,
    isDrawer,
    gameUpdate,
    gameMessages,
    wordOptions,
  };

  return { ...gameState, selectWord };
}


