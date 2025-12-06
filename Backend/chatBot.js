import readline from "node:readline/promises";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const myCache = new NodeCache({ stdTTL: 60 * 60 * 24 }); //24 hours

export async function generate(userMessage, threadId) {
  const baseMessages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked question.
            You have to access the following tools:
            1. searchWeb({query}: {query:string}) //Search the latest information and realtime data on the internet.
            current date and time: ${new Date().toUTCString()}`,
    },
  ];

  const messages = myCache.get(threadId) ?? baseMessages;

  messages.push({
    role: "user",
    content: userMessage,
  });

  const MAX_RETRIES = 10;
  let count = 0;

  while (true) {
    if (count > 10) {
      return "I could not find the result, please try again...";
    }
    count++;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and realtime data on the internet.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search on.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completion.choices[0]?.message);
    const toolCalls = completion.choices[0]?.message?.tool_calls;
    if (completion.choices[0]?.message?.content?.includes("<function=")) {
      continue;
    }

    if (!toolCalls) {
      const result = completion.choices[0]?.message?.content;
      console.log(`Assistant: ${result}`);
      if (result.trim() === "") {
        continue;
      }
      myCache.set(threadId, messages);

      return result;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));

        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }
}
// }

async function webSearch({ query }) {
  console.log("Calling web search ....");
  const response = await tvly.search(query);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResult;
}
