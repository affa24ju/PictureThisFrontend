import { ChatMessage } from "../components/ChatMessage";
import { KonvaDrawing } from "../components/Konva";

export default function GamePage() {
  return (
    <div className="flex flex-row min-h-screen gap-8">
      <div className="flex-1 flex flex-col justify-end items-start pl-8">
        <ChatMessage />
      </div>
      <div className="flex-1 flex flex-col justify-end items-end pr-8">
        <KonvaDrawing />
      </div>
    </div>
  );
}
