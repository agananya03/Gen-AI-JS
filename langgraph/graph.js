import { ChatCohere } from "@langchain/cohere";
import 'dotenv/config'

const llm = new ChatCohere({
    apiKey: process.env.COHERE_API_KEY,
    model: "embed-english-v3.0",
});

async function callcohere(state){
    console.log(`Inside callcohere`, state);
}