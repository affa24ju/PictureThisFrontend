import { useChatClient } from "../utils/UseChatClient";
import { TextArea } from "@radix-ui/themes";
import { useState } from "react";

export function ChatMessage() {
  const { messages, sendMessage } = useChatClient();
  const [input, setInput] = useState("");
  // trycker man på enter så skickas meddelandet
  const keyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter pressed, sending message:", input);
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col justify-end min-h-screen">
      <div className="flex flex-col gap-2 p-4">
        <ul className="mb-2">
          {messages.map((mes, i) => (
            <li key={i}>
              <strong>{mes.userName ?? "Unknown"}:</strong> {mes.messageContent}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <TextArea
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tryck på enter för att skicka"
            onKeyDown={keyPress}
          />
        </div>
      </div>
    </div>
  );
}
