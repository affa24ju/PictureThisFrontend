import { ChatMessage } from "../components/ChatMessage";
import { KonvaDrawing } from "../components/Konva";
import { Logout } from "../components/Logout";
import { useChatClient } from "../utils/UseChatClient";
import { useGameState } from "../utils/UseGameState";
// huvudsidan för spelet, här finns både chatten och ritfunktionen
export default function GamePage() {
  const gameState = useGameState();
  const { isDrawer, gameMessages } = gameState;
  const { messages, sendMessage } = useChatClient(gameMessages);

  return (
    <div className="flex flex-row min-h-screen gap-8">
      <div className="absolute top-6 right-8 z-50">
        <Logout />
      </div>
      <div className="flex-1 flex flex-col justify-end items-start pl-8">
        <ChatMessage messages={messages} sendMessage={sendMessage} />
      </div>
      <div className="flex-1 flex flex-col justify-end items-end pr-8">
        <KonvaDrawing isDrawer={isDrawer} />
      </div>
    </div>
  );
}
