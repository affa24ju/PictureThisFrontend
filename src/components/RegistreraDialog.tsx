import * as Dialog from '@radix-ui/react-dialog';

export default function RegistreraDialog() {
    return (
        <div>
            {/* Dialog.Root hanterar öppet/stängt. Kan kontrollera via 'open' & 'onChange' om man vill */}
            <Dialog.Root>
                {/* .Trigger funkar som handtag som öppnar dialog & asChild, renderar som child till trigger element */}
                <Dialog.Trigger asChild>
                    {/* Registrera knapp. Den är inuti .Trigger asChild vilket gör: klick på den aktiverar Dialog.Trigger */}
                    <button className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                        Registrera
                    </button>
                </Dialog.Trigger>

                {/* Dialog.Portal: renderar dialogens overlay & content i ett portal-lager (appendas i document.body) */}
                <Dialog.Portal>
                    {/* Overlay: bakgrundsöverlägg när dialog är öppen */}
                    {/* Klick på overley stänger dialogen vilket är default-beteende i Radix */}
                    {/* Ska fixa sen....en vacker dag! */}
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />

                    
                    {/* Dialog.Content: själva modalrutan */}
                    {/* Inuti Content hanterar Radix fokusfälla automatiskt, alltså fokus stannar i modulen när den är öppen */}
                    {/* & bra att veta aria attribute kopplas till Title & Description */}
                    <Dialog.Content className="fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl">
                        
                        {/* Rubrik till modal fönster */}
                        <Dialog.Title className="text-xl font-bold mb-4">Registrera dig!</Dialog.Title>

                        {/* Texter som visas under rubriken. */}
                        <Dialog.Description className="text-lg text-gray-600 mb-4">
                            Skapa ett konto för att börja spela! Det tar mindre än en minut. Lovar!😉
                        </Dialog.Description>

                        <form className="flex flex-col gap-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // TODO: Ska lägga till registreringslogik här
                                alert('Registrering lyckades! (inte riktigt...Skojar bara!!)');
                            }}
                        >
                            <input type="text" placeholder="Användarnamn" className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                            <input type="password" placeholder="Password" className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                            <button type='submit' className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Skapa konto & kör igång!
                            </button>
                        </form>

                        
                        {/* Dialog.Close: stänger rutan */}
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