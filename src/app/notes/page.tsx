import Note from "@/components/ui/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Brainlog - Notes  "
};


export default async function NotesPage () {


    const { userId } = auth();
    if(!userId) throw Error("userId undefined");

    const allNotes = await prisma.note.findMany({where: {userId}})
    console.log(allNotes,'Data');
    // try {

    //     return allNotes;
        
    // } catch (error) {
        
    // }


    return( 
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {
                allNotes.map((notes) => (
                    <Note note={notes} key={notes.id} />
                ))
            }
            {allNotes.length === 0 && (
                <div className="col-span-full text-center text-4xl">
                   {" You dont have any Note yet... ja na note bana na idhar kya dekh rha hai "}
                </div>
            )}
        </div>
    )
}
