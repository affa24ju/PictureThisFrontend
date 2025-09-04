
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-800">
                Welcome to PictureThis!
            </h1>
            {/* Välkommstext till PictureThis! */}
            <p className="mt-4 text-gray-600">
                Ett roligt ritspel där en spelare ritar och de andra gissar vad det är i chatten.
                <br />
                Bla...bla..bla..
                <br />
                Ha det så kul!
            </p>

        </div>

    </div>
  );
}