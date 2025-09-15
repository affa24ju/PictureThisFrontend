
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


export function getUserNameFromToken(): string | null {

// extrahera användarnamn från token
         
          const token = Cookies.get("currentUser"); // or retrieve from your auth provider
          if(!token) return null;
            const decoded: any =jwtDecode(token);
            return decoded.sub;
          
        }