import { useChatClient } from "../utils/UseChatClient";

export function ChatMessage() {
  useChatClient();
  return (
    <>
      <textarea placeholder="Reply to comment…" />
      <button>send</button>
    </>
  );
}
