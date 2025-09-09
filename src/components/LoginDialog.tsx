import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { loginUser } from "../utils/userApi";

export default function LoginDialog() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser({ userName, password });

    console.log("Log in as: ", res);

    // kollar så att userdata finns
    if (res.success) {
      const userData = {
        _id: res.data._id,
        userName: res.data.userName,
      };
      console.log(userData);
      alert("Login successful!");
      window.location.href = "/gamepage";
    } else {
      alert("Login failed. Please check your credentials and try again.");
    }
  };
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="px-6 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
            Logga in
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl">
            {/* Rubrik */}
            <Dialog.Title className="text-xl font-bold mb-4">
              Logga in
            </Dialog.Title>

            {/* Beskrivningstext under rubriken */}
            <Dialog.Description className="text-lg text-gray-600 mb-4">
              Ange dina inloggningsuppgifter för att fortsätta. <br />
              Om du inte har ett konto, registrera dig först! Registrering tar
              mindre än en minut! 😉
            </Dialog.Description>

            {/* Formulär för att ta emot userName & password */}
            <form
              className="flex flex-col gap-3"
              id="loginForm"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: Ska lägga till inloggningslogik här
                handleLogin(e);
              }}
            >
              <input
                type="userName"
                id="userName"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Användarnamn"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <button
                type="submit"
                id="loginBtn"
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Logga in & fortsätt!!
              </button>
            </form>

            {/* Stänger rutan  */}
            <Dialog.Close asChild>
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                X
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
