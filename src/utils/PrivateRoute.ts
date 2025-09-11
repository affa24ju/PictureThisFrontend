import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem("currentUser");
  return token ? children : (window.location.href = "/");
};
export default PrivateRoute;
