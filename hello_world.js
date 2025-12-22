import Groq from "groq-sdk";
import 'dotenv/config'
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function runChat() {
  const chatCompletion = await client.chat.completions.create({
    messages: [
        {role: 'system', content: `Your name is fastes AI`},
      {
        role: "user",
        content: "Hey, How are you ? What is your name?",
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  console.log(chatCompletion.choices[0].message.content);
}

runChat();



//Few shot prompting: You give examples to LLM
//Zero shot prompting: Direct question or tasks are given without prior examples.
//Chain of thought: Model is encouraged to break down reasoning step by step before arriving at an answer.