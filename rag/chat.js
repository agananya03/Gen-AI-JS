import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";
import 'dotenv/config'

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function chat() {
    const userQuery = 'Can you tell me about rules of undertaking by parent/guardian'
    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "models/embedding-001"
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: 'http://localhost:6333',
    collectionName: 'Gen_ai_collection'
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

const response = await openai.chat.completions.create({
    model: "gemini-1.5-flash",
    messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
            role: "user",
            content: userQuery,
        },
    ],
});
console.log(`> ${response.choices[0].message.content}`);
}

chat()