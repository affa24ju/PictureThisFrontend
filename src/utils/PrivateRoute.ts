import type { JSX } from "react";

// en privat rutt komponent som kollar om användaren är inloggad
type Props = {
  children: JSX.Element;
};
// är den inte inloggad så har den inte tillgång till sidor man sätter PrivateRoute på
const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem("currentUser");
  return token ? children : (window.location.href = "/");
};
export default PrivateRoute;
