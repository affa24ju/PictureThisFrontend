
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  
}
// skapar en token
export function getUserIdFromToken(): string {

const token = Cookies.get("currentUser"); // JWT-token
if (!token) throw new Error("Ingen token hittad");

    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.sub;

}