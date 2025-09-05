import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import { ChatMessage } from "./components/ChatMessage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gamepage" element={<GamePage />} />
        <Route path="/chatpage" element={<ChatMessage />} />
      </Routes>
    </BrowserRouter>
  );
}
