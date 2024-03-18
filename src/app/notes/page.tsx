import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Brainlog - Notes  "
};


export default async function NotesPage () {


    const { userId } = auth();

    if(!userId) throw Error("userId undefined");

    // const allNotes = await prisma.note.findMany({where: {userId}})
    const allNotes = prisma.note.findMany({where: {userId}})

    return <div>{JSON.stringify(allNotes)}</div>
}
