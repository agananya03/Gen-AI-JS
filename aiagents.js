import Groq from "groq-sdk";
import 'dotenv/config'
import axios from "axios";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getweatherDetailsbycity(cityname = '') {
    const url = `https://wttr.in/${cityname.toLowerCase()}?format=%c+%t`
    const {data} = await axios.get(url, { responseType: 'text',timeout: 5000,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }});
    return `The current weather of ${cityname} is ${data}`
}

const TOOL_MAP = {
    getweatherDetailsbycity: getweatherDetailsbycity
}

async function main(){
    const SYSTEM_PROMPT = `
        You are an AI agent.

        RULES:
        1. Always respond with EXACTLY ONE valid JSON object.
        2. Never write text outside the JSON.
        3. Never invent tool names.
        4. If the user asks about weather, you MUST return this format:

        {
        "action": "tool",
        "tool_name": "getweatherDetailsbycity",
        "input": "<city name>",
        "content": null
        }

        Do NOT use "final" for weather requests.
        `;

    const messages = [
        {
            role: 'system',
            content: SYSTEM_PROMPT,
        },
        {
            role: 'user',
            content: 'Tell me the current weather of Delhi.'
        },
    ];
    const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
        });

        const raw = response.choices?.[0]?.message?.content || "";

        let parsed;
        try {
        parsed = JSON.parse(raw);
        } catch (e) {
        console.error("❌ Model did not return JSON:\n", raw);
        return;
        }

        if (parsed.action === "tool") {
        const tool = TOOL_MAP[parsed.tool_name];
        if (!tool) {
            console.error("❌ Unknown tool:", parsed.tool_name);
            return;
        }

        const toolResult = await tool(parsed.input);
        console.log("🌦️", toolResult);
        return;
        }

        if (parsed.action === "final") {
        console.log("🌦️", parsed.content);
        }

    console.log("DONE.....")
}

main()