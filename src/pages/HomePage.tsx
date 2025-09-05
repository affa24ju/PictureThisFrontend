import RegistreraDialog from "../components/RegistreraDialog";
import LoginDialog from "../components/LoginDialog";

export default function HomePage() {
  return (
    // Div med bakgrundsgradient och centrerad innehåll
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        {/* Rutan där visas texter, 'registrera' och 'login'  */}
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
            {/* Rubriken, kan lägga till roliga ikoner sen! */}
            <h1 className="text-4xl font-bold text-gray-800">
                Welcome to PictureThis!
            </h1>
            {/* Välkommstexter till PictureThis! */}
            <p className="mt-4 text-gray-600">
                Ett roligt ritspel där en spelare ritar och de andra gissar vad det är i chatten.
                <br />
                Bla...bla..bla..
                <br />
                Ha det så kul!
            </p>
            
            {/* Här inne i div:en ska lägga till 'registrera' & 'login' */}
            <div className="flex gap-4 justify-center mt-6">
                <RegistreraDialog />
                {/* Login komponent kommer här sen */}
                <LoginDialog />
            </div>

        </div>

    </div>
  );
}