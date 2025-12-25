import { CohereEmbeddings } from "@langchain/cohere";
import { QdrantVectorStore } from "@langchain/qdrant";
import Groq from "groq-sdk";
import 'dotenv/config'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function chat() {
    const userQuery = 'Can you tell me about BigBang model'
    const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY,
        model: "embed-english-v3.0",
    });

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: 'http://localhost:6333',
    collectionName: 'Gen_aicollection'
});

const vectorSearcher = vectorStore.asRetriever({
    k: 3,
});

const relevantChunk = await vectorSearcher.invoke(userQuery);
const SYSTEM_PROMPT = `
    You are an AI Assistant who helps resolving user query based on the context available to you from a PDF file with the content and page number.
    Only ans based on the available context from file only.

    Content:
    ${JSON.stringify(relevantChunk)}
`

const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // or "llama-3.1-70b-versatile", "llama-3.1-8b-instant"
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: userQuery,
            },
        ],
        temperature: 0.7,
        max_tokens: 1024,
    });
console.log(`> ${response.choices[0].message.content}`);
}

chat()