import { TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { useRef, useEffect } from "react";

interface ChatMessageProps {
  messages: Array<{ messageContent: string; userName: string }>;
  sendMessage: (message: string) => void;
}

export function ChatMessage({ messages, sendMessage }: ChatMessageProps) {
  const messagesEndRef = useRef<HTMLLIElement | null>(null);
  const [input, setInput] = useState("");
  const userColors: { [name: string]: string } = {};

  const palette = [
    "#7F9CF5",
    "#A78BFA",
    "#F472B6",
    "#38BDF8",
    "#818CF8",
    "#C084FC",
    "#F472B6",
    "#60A5FA",
    "#F0ABFC",
    "#5EEAD4",
  ];
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //ändrar färg på användarnamn
  const getUserColors = (name: string) => {
    if (!userColors[name]) {
      const color =
        Math.abs(
          Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
        ) % palette.length;
      userColors[name] = palette[color];
    }
    return userColors[name];
  };

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
        <ul
          className="mb-2"
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "8px",
            maxHeight: "500px",
            overflowY: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {messages.map((mes, i) => (
            <li
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              key={i}
              style={{
                backgroundColor: getUserColors(mes.userName),
                color: "black",
              }}
              // ser till att sista meddelandet alltid syns
              ref={i === messages.length - 1 ? messagesEndRef : null}
            >
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
