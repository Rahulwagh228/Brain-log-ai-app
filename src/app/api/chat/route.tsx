import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import {openai} from "@/lib/openai";
import {OpenAIStream, StreamingTextResponse} from "ai"

export async function POST(req: Request){
    try {
        const body = await req.json();

        const messages: ChatCompletionMessage[] = body.messages;

        const messagesTruncated = messages.slice(-6);

        const embedding = await getEmbedding(
            messagesTruncated.map((message)=>message.content).join("\n")
        )

        const {userId} = auth();

        const vectorQueryResponse = await notesIndex.query({
            vector: embedding,
            topK: 1,
            filter: {userId}

        })

        const releventNotes = await prisma.note.findMany({
            where:{
                id:{
                    in:vectorQueryResponse.matches.map((match)=>match.id)
                }
            }
        })

        console.log("Relevent notes founds: ", releventNotes);

        const systemMessage: ChatCompletionMessage = {
            role:"assistant",
            content: 
            "You are an intelligent note-taking app. You answer the user's question based on their existing notes" +
            "The relevant notes for this query are: \n" +
            releventNotes.map((note)=>`title: ${note.title} \n\n Content: \n ${note.content}`)
            .join("\n\n"),
        };

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [systemMessage, ...messagesTruncated]
        })


        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.log(error);
        return Response.json({error: "internal Serverr error"}, {status: 500 });
    }
}