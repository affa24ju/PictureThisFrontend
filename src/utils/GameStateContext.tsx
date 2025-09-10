import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useGameState } from './UseGameState';

interface GameState {
  currentWord: string | null;
  isDrawer: boolean;
  gameUpdate: any | null;
  gameMessages: any[];
}

const GameStateContext = createContext<GameState | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  console.log("GameStateProvider: Initializing...");
  const gameState = useGameState();
  console.log("GameStateProvider: gameState:", gameState);
  
  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameStateContext() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
}
