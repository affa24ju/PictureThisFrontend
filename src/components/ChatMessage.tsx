import { useChatClient } from "../utils/UseChatClient";
import { TextArea } from "@radix-ui/themes";
import "../css/ChatMessageCss.css";
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
    }
  };

  return (
    <div className="flex flex-col justify-end min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="flex items-center gap-2 p-4">
        <ul>
          {messages.map((mes, i) => (
            <li key={i}>
              {mes.user.userName}: {mes.content}
            </li>
          ))}
        </ul>
        <TextArea
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reply to comment…"
          onKeyDown={keyPress}
        />
        <button className="h-10 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          send
        </button>
      </div>
    </div>
  );
}
