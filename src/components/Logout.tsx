import { useState } from "react";
import Cookies from "js-cookie";

//funktion för att logga ut
export function Logout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // kollar i Cookies och tar bort currentuser och återvänder till startsidan
  const handleLogout = () => {
    Cookies.remove("currentUser"); // Tar bort JWT-token
    setIsLoggedIn(false);
    window.location.href = "/";
    window.location.reload();
  };

  return (
    <div>
      {isLoggedIn && (
        <span>
          <button
            className="px-6 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            onClick={handleLogout}
          >
            logga ut
          </button>
        </span>
      )}
    </div>
  );
}
